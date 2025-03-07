import QueryBuilder from "../../builder/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createUserIntoDB = async (user: TUser) => {
  const result = await User.create(user);

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    User.find(),
    // .populate("user")
    // .populate("admissionSemester")
    // .populate("academicDepartment academicFaculty"),
    query
  )
    .search(userSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
};
