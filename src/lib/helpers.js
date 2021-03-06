import jwt_decode from 'jwt-decode';
import {
  getTokenAsync,
  setTokenAsync,
  getVerifiedAsync,
  VerifiedStates,
  setProgramCollectionsAsync,
} from './storage';
import {getProgramCollectionsAsync, renewToken} from './api';
import {Screens} from './screens';
import moment from 'moment';

export async function isTokenExpired() {
  try {
    const token = await getTokenAsync();
    if (!token) {
      return true;
    }

    const decoded = jwt_decode(token);
    const offsetSeconds = 30;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    const currentDate = Math.floor(Date.now().valueOf());
    const adjustedTime = currentDate + offsetSeconds * 1000;
    const isExpired = date.valueOf() < adjustedTime;
    console.info(
      `exp time: ${date.valueOf()} and current time: ${adjustedTime}`,
    );
    console.info(`isExpired: ${isExpired}`);
    return isExpired;
  } catch (error) {
    console.error(error);
  }
}

export async function refreshTokenAsync() {
  try {
    let success = false;
    const currentToken = await getTokenAsync();

    if (!currentToken) {
      return {success: success};
    } else {
      const renewResponse = await renewToken(currentToken);
      if (renewResponse.success) {
        await setTokenAsync(renewResponse.token);
        success = true;
        console.info('refresh token success');
      }
      return {success: success};
    }
  } catch (error) {
    console.error(error);
  }
}

export async function refreshProgramCollectionsAsync() {
  let success = false;
  try {
    const response = await getProgramCollectionsAsync();
    if (response.success) {
      await setProgramCollectionsAsync(response.programCollections);
      success = true;
    }
    return {success: success};
  } catch (error) {
    console.error(error);
    return {success: success};
  }
}

export async function getStartScreenAsync() {
  try {
    const verified = await getVerifiedAsync();
    const isExpired = await isTokenExpired();

    console.info(`verified: ${verified} isExpired: ${isExpired}`);
    switch (verified) {
      case VerifiedStates.Unverifed:
        return Screens.SIGNIN;
      case VerifiedStates.PendingVerification:
        return Screens.VERIFY;
      case VerifiedStates.Verified:
        if (!isExpired) {
          console.info("I'm going home!");
          return Screens.HOME;
        } else {
          console.info("I'm returning signin");
          return Screens.SIGNIN;
        }
      default:
        return Screens.SIGNIN;
    }
  } catch (error) {
    return Screens.HOME;
  }
}

export function getDisplayDate(dateString) {
  return moment(dateString).format('dddd MMMM Do YYYY');
}

export function getShortDisplayDate(dateString) {
  return moment(dateString).format('MM/DD/YYYY');
}

export function getDisplayTime(dateString) {
  return moment(dateString).format('h:mm a');
}

export function updateYear(dateString, year) {
  const updatedDate = moment(dateString).set('year', year);
  return new Date(updatedDate).valueOf();
}

export function updateMonth(dateString, month) {
  const updatedDate = moment(dateString).set('month', month);
  return new Date(updatedDate).valueOf();
}

export function updateDay(dateString, day) {
  const updatedDate = moment(dateString).set('day', day);
  return new Date(updatedDate).valueOf();
}

export function updateDate(date) {
  const updatedDate = moment()
    .year(date.getFullYear())
    .month(date.getMonth())
    .date(date.getDate());
  return new Date(updatedDate).valueOf();
}

export function updateHour(dateString, hour) {
  const updatedDate = moment(dateString).set('hour', hour);
  return new Date(updatedDate).valueOf();
}

export function updateMinute(dateString, minute) {
  const updatedDate = moment(dateString).set('minute', minute);
  return new Date(updatedDate).valueOf();
}

export function getElapsedTime(startTime) {
  const duration = moment.duration(moment(Date.now()).diff(moment(startTime)));
  return {
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
  };
}

export function getSecondsFromTime(time) {
  return time.hours * 60 * 60 + time.minutes * 60 + time.seconds;
}

export function getDisplayTimeFromSeconds(seconds) {
  const duration = moment.duration(seconds, 'seconds');

  const span = {
    hours: duration.get('hours'),
    minutes: duration.get('minutes'),
    seconds: duration.get('seconds'),
  };

  const hoursDisplay = span.hours > 0 ? ` ${span.hours} Hours` : '';
  const minutesDisplay = span.minutes > 0 ? ` ${span.minutes} Minutes` : '';
  const secondsDisplay = span.seconds > 0 ? ` ${span.seconds} Seconds` : '';

  return `${hoursDisplay}${minutesDisplay}${secondsDisplay}`;
}
