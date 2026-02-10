import admin from "firebase-admin";

const db = admin.firestore();

// Firestore collection reference
const usersCollection = db.collection("users");

// User model with validation methods
const User = {
  /**
   * Create a new user document in Firestore
   * @param {string} uid - Firebase Auth UID
   * @param {object} userData - User data object
   */
  async create(uid, userData) {
    const { fullName, username, password, gender, profilePic = "" } = userData;

    // Validation
    if (!fullName || !username || !password || !gender) {
      throw new Error(
        "Missing required fields: fullName, username, password, gender",
      );
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }
    if (!["male", "female"].includes(gender)) {
      throw new Error("Gender must be either 'male' or 'female'");
    }

    // Check if username already exists
    const existingUser = await usersCollection
      .where("username", "==", username)
      .get();
    if (!existingUser.empty) {
      throw new Error("Username already exists");
    }

    const userDoc = {
      uid,
      fullName,
      username,
      password,
      gender,
      profilePic,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await usersCollection.doc(uid).set(userDoc);
    return userDoc;
  },

  /**
   * Get user by UID
   * @param {string} uid - Firebase Auth UID
   */
  async getById(uid) {
    const doc = await usersCollection.doc(uid).get();
    if (!doc.exists) {
      return null;
    }
    return { uid: doc.id, ...doc.data() };
  },

  /**
   * Get user by username
   * @param {string} username - Username
   */
  async getByUsername(username) {
    const query = await usersCollection.where("username", "==", username).get();
    if (query.empty) {
      return null;
    }
    const doc = query.docs[0];
    return { uid: doc.id, ...doc.data() };
  },

  /**
   * Update user document
   * @param {string} uid - Firebase Auth UID
   * @param {object} updateData - Fields to update
   */
  async update(uid, updateData) {
    const allowedFields = ["fullName", "gender", "profilePic"];
    const filteredData = {};

    for (const key of allowedFields) {
      if (key in updateData) {
        filteredData[key] = updateData[key];
      }
    }

    filteredData.updatedAt = admin.firestore.FieldValue.serverTimestamp();
    await usersCollection.doc(uid).update(filteredData);
    return this.getById(uid);
  },

  /**
   * Delete user document
   * @param {string} uid - Firebase Auth UID
   */
  async delete(uid) {
    await usersCollection.doc(uid).delete();
  },
};

export default User;
