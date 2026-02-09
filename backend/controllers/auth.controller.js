export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
  } catch (error) {}
};

export const login = (req, res) => {
  console.log("Login user route");
  res.send("Login route");
};
export const logout = (req, res) => {
  console.log("Logout user route");
  res.send("Logout route");
};
