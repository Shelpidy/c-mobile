import moment from "moment";

export function dateAgo(date: Date) {
  const agoUnits = {
    "minutes ago": "m",
    "seconds ago": "s",
    "days ago": "d",
    "hours ago": "h",
    "minute ago": "m",
    "second ago": "s",
    "day ago": "1 d",
    "hour ago": "1 h",
    "an hour ago":"1 h",
    "a second ago":"just now",
    "a minute ago":"1 min",
    "a week ago":"1 w"
  } as any;

  const now = moment();
  const ago = moment(date).fromNow();

  return ago.replace(/(hours|an hour|minutes|a minute|seconds|a second|days|a day|a week|weeks|months|a month) ago/, (match) => {
    const unit = match.toLowerCase();
    console.log(unit)
    return agoUnits[unit];
  });
}
