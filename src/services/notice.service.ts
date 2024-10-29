import { StatusCodes } from "http-status-codes";
import Notice from "../models/notice.model";
import User from "../models/user.model";
import { ApiError } from "../utils/error";
import * as Yup from "yup";

export default class NoticeService {
  public async getAllNotices(page: number, size: number) {
    const result = await Notice.findAndCountAll({
      limit: size,
      offset: size * (page - 1),
      where: { deletedAt: null },
      include: [{ model: User, attributes: ["name"], as: "author" }],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });

    return result;
  }

  public async createNotice(payload: { title: string; content: string; authorId: number }) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      content: Yup.string().required(),
      authorId: Yup.number().required(), 
    });

    const isUserExists = await User.findOne({
      where: {_id: payload.authorId}
    }).then((user) => user !== null);

    if (!isUserExists) throw new ApiError("Bad Reqeust", StatusCodes.BAD_REQUEST);

    if (!(await schema.isValid(payload))) {
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);
    }

    const result = await Notice.create(payload);

    if (!result) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    return result;
  }

  public async getNoticeById(noticeId: number) {
    const notice = await Notice.findOne({
      where: { _id: noticeId, deletedAt: null },
      include: [{ model: User, attributes: ["name"], as: "author" }],
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });

    if (!notice) throw new ApiError("Not Found", StatusCodes.NOT_FOUND);

    return notice;
  }

  public async deleteNotice(noticeId: number) {
    const isIdNumber = Yup.number().required();

    if (!(await isIdNumber.isValid(noticeId))) {
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);
    }

    const result = await Notice.destroy({ where: { _id: noticeId } });

    if (!result) throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);

    return true;
  }

  public async updateNotice(noticeId: number, payload: { title?: string; content?: string }) {
    const schema = Yup.object().shape({
      title: Yup.string().notRequired(),
      content: Yup.string().notRequired(),
    });

    if (!(await schema.isValid(payload))) {
      throw new ApiError("Bad Request", StatusCodes.BAD_REQUEST);
    }

    const result = await Notice.update(payload, { where: { _id: noticeId } });

    if (result[0] === 0) throw new ApiError("Not Found", StatusCodes.NOT_FOUND);

    return true;
  }
}
