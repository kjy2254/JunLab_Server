const axios = require("axios");

const users = [];

for (let i = 25; i <= 35; i++) {
  users.push({
    id: `hanvm${i}`,
    password: `a123456789`,
    password2: `a123456789`,
    name: `User ${i}`,
    gender: `Male`,
    birth: `2000-01-01`,
    code: `Do2OPeb`,
    email: ``,
    phone: ``,
    address: ``,
  });
}

const signupUsers = async () => {
  for (const user of users) {
    try {
      const response = await axios.post(
        "http://junlab.postech.ac.kr:880/login/signup2",
        user
      );
      console.log(`${user.id}: ${response.data.isSuccess}`);
    } catch (error) {
      console.error(`${user.id}: 에러 발생 - ${error.message}`);
    }
  }
};

signupUsers();
