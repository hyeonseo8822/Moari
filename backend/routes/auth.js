const router = require('express').Router();
const admin = require('../firebase');
const axios = require('axios');

// Signup
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    console.log("Received email for signup:", email); // Debugging line
    try {
        const userRecord = await admin.auth().createUser({
            email: email,
            password: password,
        });
        res.status(201).send({ message: '회원가입 완료!', uid: userRecord.uid });
    } catch (error) {
        console.error("Signup Error:", error); // Explicitly log the error
        res.status(400).send({ message: '계정 생성 오류', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const apiKey = process.env.FIREBASE_API_KEY; // I will get this from the user

    if (!apiKey) {
        return res.status(500).send({ message: 'Firebase API Key not configured.' });
    }

    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    try {
        const response = await axios.post(signInUrl, {
            email: email,
            password: password,
            returnSecureToken: true,
        });

        const { idToken } = response.data;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;
        
        const customToken = await admin.auth().createCustomToken(uid);
        res.status(200).send({ token: customToken });

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            return res.status(400).send({ message: error.response.data.error.message });
        }
        res.status(400).send({ message: 'Error logging in', error: error.message });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    const { idToken } = req.body;

    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const uid = decodedToken.uid;

        const customToken = await admin.auth().createCustomToken(uid);
        res.status(200).send({ token: customToken });
    } catch (error) {
        res.status(400).send({ message: 'Error verifying Google token', error: error.message });
    }
});

module.exports = router;
