import moment from "moment";

export function isInThisMonth(date: Date): boolean {
  return moment(date).isSame(new Date(), "month");
}
