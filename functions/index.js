const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.addAdminRole = functions.https.onCall(async (data, context) => {
  //get user and add custom claim (admin)
  try {
    const user = await admin.auth().getUserByEmail(data.email);
    await admin.auth().setCustomUserClaims(user.uid, {
      admin: true
    });
    return {
      message: `Success! ${data.email} has been made admin`
    };
  } catch (err) {
    return err;
  }
});

//"firebase projects:list" to check the projects
// firebase use <project_id> to change to another project
