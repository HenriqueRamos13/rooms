import sanitizeHtml from "sanitize-html";

function iterAll(object: any) {
  Object.keys(object).forEach(function (k) {
    if (
      typeof object[k] === "boolean" ||
      typeof object[k] === "undefined" ||
      typeof object[k] === "function" ||
      typeof object[k] === "symbol"
    ) {
      return;
    }

    if (object[k] && typeof object[k] === "object") {
      iterAll(object[k]);
      return;
    }
    const verifyIfIsNumber =
      typeof object[k] === "string" ? false : !Number.isNaN(object[k]);

    object[k] = sanitizeHtml(object[k], {
      allowedTags: [],
      allowedAttributes: {},
    });

    if (verifyIfIsNumber) {
      object[k] = Number(object[k]);
    }
  });
}

export const Sanitize = (value: any) =>
  new Promise((resolve, reject) => {
    try {
      iterAll(value);
      resolve(value);
    } catch (error) {
      throw new Error("Validation failed - " + error);
    }
  });
