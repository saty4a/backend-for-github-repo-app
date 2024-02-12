const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export const emailFormatChecker = (email) => {
    if (email.match(mailFormat)) {
      return true;
    } else {
      return false;
    }
};