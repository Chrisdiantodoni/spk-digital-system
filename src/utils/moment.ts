import moment from "moment"


export const momentYYYMMDDHHmmss = (date: Date) => {
  if (!date) {
    return "-"
  }
  return moment(date).format("YYYY-MM-DD HH:mm:ss")
}
export const momentYYYMMDD = (date: Date) => {
  if (!date) {
    return "-"
  }
  return moment(date).format("YYYY-MM-DD")
}