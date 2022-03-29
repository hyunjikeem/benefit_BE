const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Admin } = require('../models');

const adminSignup = async (req, res) => {
    try {
        const { adminId, password } = req.body;

        const encodedPassword = bcrypt.hashSync(password, parseInt(process.env.SECRET_SALT));

        await Admin.create({
            adminId, password: encodedPassword,
        });
        return res.status(201).send({
            ok: true,
            message: '관리자 회원가입에 성공하였습니다.',
        });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            ok: false,
            errorMessage: '관리자 회원가입에 실패하였습니다.',
        });
    };
};

const adminLogin = async (req, res) => {
    try {
      const { adminId, password } = req.body;
      const admin = await Admin.findOne({
          where: { adminId },
      });

      if (!admin) {
          res.status(200).send({
              ok: false,
              errorMessage: '아이디 또는 패스워드를 다시 확인해주세요',
          });
          return;
      }

      if (!bcrypt.compareSync(password, admin.password)) {
          return res.status(200).send({
              ok: false,
              errorMessage: '아이디 또는 패스워드를 다시 확인해주세요',
          });
      };

      const token = jwt.sign({
          adminId: admin.adminId
      }, process.env.TOKENKEY);
      return res.send({
          ok: true,
          token,
      });
    } catch (error) {
        console.log(error);
        res.status(200).send({
            ok: false,
            errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
        });
    };
}

module.exports = {
    adminSignup,
    adminLogin,
}