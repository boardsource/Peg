import { FileTreeData } from "../../../types/types";


export const delay = (time: number = 370) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const cleanString = (str: string) => {
  return `${str}`.replaceAll("\n", "").replaceAll("\r", "");
};
export const comparStrings = (str1: string, str2: string) => {
  return cleanString(str1) === cleanString(str2);
};
export const escapeCharacters = (str: string) => {
  return `${str}`
    .replaceAll("\n", "\\n")
    .replaceAll("\r", "\\r")
    .replaceAll("\t", "\\t");
};

const treeSearch = (
  fullPath: string,
  pathParts: string[],
  tree: FileTreeData
): FileTreeData | undefined => {
  console.log("tree searching", pathParts, tree);
  let foundTree = undefined;
  const cloneParts = [...pathParts];
  const searchingPart = cloneParts.shift();
  if (tree.children) {
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      if (child.title === searchingPart) {
        if (child.key === fullPath) {
          foundTree = child;
        } else {
          foundTree = treeSearch(fullPath, cloneParts, child);
        }
        break;
      }
    }
  }
  return foundTree;
};

export const findItemInTree = (path: string, tree: FileTreeData) => {
  let pathParts = path.split("/");
  pathParts.shift();
  let foundTree = treeSearch(path, pathParts, tree);
  return foundTree;
};

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export const getErrorMessage = (error: unknown) => {
  return ` ,${toErrorWithMessage(error).message} `;
};
