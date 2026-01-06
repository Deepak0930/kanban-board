export const sleep = (time, shouldResolve = true) =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      if (shouldResolve) resolve();
      else reject(new Error('Oops!! Something went wrong.'));
    }, time)
  );
