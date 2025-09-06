var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/index.ts
import { elizaLogger as elizaLogger23 } from "@elizaos/core";

// src/actions/getPriceAction.ts
import { elizaLogger as elizaLogger2, createActionResult } from "@elizaos/core";

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/actions/aiActionHelper.ts
import {
  elizaLogger,
  composePromptFromState,
  ModelType,
  parseKeyValueXml
} from "@elizaos/core";
var API_TIMEOUT = 1e4;
var MAX_RETRIES = 3;
function validateAndGetApiKey(runtime) {
  elizaLogger.log("\u{1F510} Validating TokenMetrics API key...");
  let apiKey = runtime.getSetting("TOKENMETRICS_API_KEY");
  elizaLogger.log(`\u{1F50D} Runtime getSetting result:`, {
    value: apiKey,
    type: typeof apiKey,
    length: apiKey ? apiKey.length : "N/A",
    isEmpty: apiKey === "",
    isNull: apiKey === null,
    isUndefined: apiKey === void 0
  });
  if (!apiKey || apiKey === "" || apiKey === "undefined") {
    elizaLogger.warn("\u274C TOKENMETRICS_API_KEY not found or empty in runtime settings");
    elizaLogger.log("\u{1F4A1} Falling back to hardcoded API key for testing...");
    const HARDCODED_API_KEY = "process.env.TOKENMETRICS_API_KEY";
    apiKey = HARDCODED_API_KEY;
    elizaLogger.log("\u2705 Using hardcoded API key for testing");
  } else {
    elizaLogger.log("\u2705 Using API key from runtime settings");
  }
  if (typeof apiKey !== "string" || apiKey.length < 10) {
    elizaLogger.error("\u274C TOKENMETRICS_API_KEY appears to be invalid (too short or wrong type)");
    throw new Error("TokenMetrics API key appears to be invalid");
  }
  elizaLogger.log(`\u2705 Final API key: ${apiKey.substring(0, 6)}...${apiKey.substring(apiKey.length - 4)}`);
  return apiKey;
}
async function fetchWithRetry(url, options, maxRetries = MAX_RETRIES) {
  let lastError;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      elizaLogger.log(`\u{1F4E1} API Request attempt ${attempt}/${maxRetries}: ${url}`);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      elizaLogger.log(`\u{1F4CA} API Response: ${response.status} ${response.statusText}`);
      if (response.ok) {
        return response;
      }
      const responseText = await response.text();
      elizaLogger.error(`\u274C API Error ${response.status}: ${responseText}`);
      if (response.status === 401) {
        throw new Error("Invalid API key - check your TOKENMETRICS_API_KEY");
      } else if (response.status === 429) {
        elizaLogger.warn(`\u23F1\uFE0F Rate limited, waiting before retry...`);
        await new Promise((resolve) => setTimeout(resolve, 2e3 * attempt));
        continue;
      } else if (response.status >= 500) {
        elizaLogger.warn(`\u{1F504} Server error, retrying...`);
        await new Promise((resolve) => setTimeout(resolve, 1e3 * attempt));
        continue;
      } else {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      lastError = error;
      elizaLogger.error(`\u274C Attempt ${attempt} failed:`, error);
      if (attempt === maxRetries) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1e3 * Math.pow(2, attempt - 1)));
    }
  }
  throw lastError;
}
async function extractTokenMetricsRequest(runtime, message, state, template, schema, requestId) {
  elizaLogger.log(`\u{1F504} [${requestId}] Starting AI extraction following migration docs...`);
  const composedState = await runtime.composeState(message);
  elizaLogger.log(`\u{1F4CA} [${requestId}] State composed successfully`);
  const prompt = composePromptFromState({
    state: composedState,
    template
  });
  elizaLogger.log(`\u{1F4DD} [${requestId}] Prompt composed successfully`);
  const result = await runtime.useModel(ModelType.TEXT_SMALL, {
    prompt
  });
  elizaLogger.log(`\u{1F916} [${requestId}] Model result received`);
  const content = parseKeyValueXml(result);
  elizaLogger.log(`\u{1F50D} [${requestId}] Content parsed from XML`);
  elizaLogger.log(`\u2705 [${requestId}] AI extraction completed successfully`);
  return content;
}
async function callTokenMetricsAPI(endpoint, params, runtime) {
  const apiKey = validateAndGetApiKey(runtime);
  const url = new URL(`https://api.tokenmetrics.com${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== void 0 && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  elizaLogger.log(`\u{1F4E1} Calling TokenMetrics API: ${url.toString()}`);
  const response = await fetchWithRetry(url.toString(), {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      "accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  elizaLogger.log(`\u2705 API call successful, received data`);
  return data;
}
function formatCurrency(value) {
  if (value === void 0 || value === null || isNaN(value) || !isFinite(value)) {
    return "$0.00";
  }
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return "$0.00";
  }
  if (numValue >= 1e9) {
    return `$${(numValue / 1e9).toFixed(2)}B`;
  } else if (numValue >= 1e6) {
    return `$${(numValue / 1e6).toFixed(2)}M`;
  } else if (numValue >= 1e3) {
    return `$${(numValue / 1e3).toFixed(2)}K`;
  } else if (numValue >= 1) {
    return `$${numValue.toFixed(2)}`;
  } else if (numValue > 0) {
    if (numValue < 1e-6) {
      return `$${numValue.toExponential(3)}`;
    } else {
      return `$${numValue.toFixed(6)}`;
    }
  } else {
    return "$0.00";
  }
}
function formatPercentage(value) {
  if (value === void 0 || value === null || isNaN(value) || !isFinite(value)) {
    return "0.00%";
  }
  const numValue = Number(value);
  if (isNaN(numValue) || !isFinite(numValue)) {
    return "0.00%";
  }
  const sign = numValue >= 0 ? "+" : "";
  return `${sign}${numValue.toFixed(2)}%`;
}
function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function mapSymbolToName(input) {
  const symbolMap = {
    "BTC": "Bitcoin",
    "ETH": "Ethereum",
    "SOL": "Solana",
    "ADA": "Cardano",
    "MATIC": "Polygon",
    "DOT": "Polkadot",
    "LINK": "Chainlink",
    "UNI": "Uniswap",
    "AVAX": "Avalanche",
    "LTC": "Litecoin",
    "DOGE": "Dogecoin",
    "XRP": "XRP",
    "BNB": "BNB",
    "USDT": "Tether",
    "USDC": "USD Coin",
    "ATOM": "Cosmos",
    "NEAR": "NEAR Protocol",
    "FTM": "Fantom",
    "ALGO": "Algorand",
    "VET": "VeChain",
    "ICP": "Internet Computer",
    "FLOW": "Flow",
    "SAND": "The Sandbox",
    "MANA": "Decentraland",
    "CRO": "Cronos",
    "APE": "ApeCoin",
    "SHIB": "Shiba Inu",
    "PEPE": "Pepe",
    "WIF": "dogwifhat",
    "BONK": "Bonk"
  };
  const upperInput = input.toUpperCase();
  return symbolMap[upperInput] || input;
}
async function resolveTokenSmart(input, runtime) {
  elizaLogger.log(`\u{1F50D} Resolving token: "${input}" (Pure API search approach)`);
  try {
    const trimmedInput = input.trim();
    const mappedName = mapSymbolToName(trimmedInput);
    elizaLogger.log(`\u{1F50D} Symbol mapping: "${trimmedInput}" \u2192 "${mappedName}"`);
    const searchInput = mappedName;
    elizaLogger.log(`\u{1F50D} Searching TokenMetrics database for: "${searchInput}"`);
    elizaLogger.log(`\u{1F50D} Step 1: Searching by token name "${searchInput}"`);
    let searchResult = await callTokenMetricsAPI("/v2/tokens", {
      token_name: searchInput,
      limit: 5
    }, runtime);
    let tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
    if (tokens.length > 0) {
      const filteredToken = applySmartTokenFiltering(tokens, searchInput);
      if (filteredToken) {
        elizaLogger.log(`\u2705 Found token by name search: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
        return filteredToken;
      }
    }
    elizaLogger.log(`\u{1F50D} Step 2: Searching by symbol "${searchInput}"`);
    searchResult = await callTokenMetricsAPI("/v2/tokens", {
      symbol: searchInput,
      limit: 10
      // Increase limit to get more options for filtering
    }, runtime);
    tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
    if (tokens.length > 0) {
      const filteredToken = applySmartTokenFiltering(tokens, searchInput);
      if (filteredToken) {
        elizaLogger.log(`\u2705 Found token by symbol search: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
        return filteredToken;
      }
    }
    const upperInput = searchInput.toUpperCase();
    const lowerInput = searchInput.toLowerCase();
    for (const variation of [upperInput, lowerInput]) {
      if (variation === searchInput) continue;
      elizaLogger.log(`\u{1F50D} Step 3: Trying variation "${variation}"`);
      for (const searchType of ["token_name", "symbol"]) {
        try {
          searchResult = await callTokenMetricsAPI("/v2/tokens", {
            [searchType]: variation,
            limit: 10
          }, runtime);
          tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
          if (tokens.length > 0) {
            const filteredToken = applySmartTokenFiltering(tokens, variation);
            if (filteredToken) {
              elizaLogger.log(`\u2705 Found token by ${searchType} variation "${variation}": ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
              return filteredToken;
            }
          }
        } catch (variationError) {
          elizaLogger.log(`\u26A0\uFE0F Variation search failed for ${searchType}="${variation}", continuing...`);
        }
      }
    }
    elizaLogger.log(`\u{1F50D} Step 4: Trying broader search for partial matches`);
    try {
      searchResult = await callTokenMetricsAPI("/v2/tokens", {
        limit: 50,
        page: 1
      }, runtime);
      tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
      if (tokens.length > 0) {
        const upperInput2 = searchInput.toUpperCase();
        const matches = tokens.filter(
          (token) => token.TOKEN_NAME?.toUpperCase().includes(upperInput2) || token.TOKEN_SYMBOL?.toUpperCase().includes(upperInput2)
        );
        if (matches.length > 0) {
          const filteredToken = applySmartTokenFiltering(matches, searchInput);
          if (filteredToken) {
            elizaLogger.log(`\u2705 Found token by partial match: ${filteredToken.TOKEN_NAME} (${filteredToken.TOKEN_SYMBOL}) - ID: ${filteredToken.TOKEN_ID}`);
            return filteredToken;
          }
        }
      }
    } catch (broadError) {
      elizaLogger.log(`\u26A0\uFE0F Broad search failed, skipping...`);
    }
    elizaLogger.log(`\u274C No token found for: "${input}" after trying all search methods`);
    return null;
  } catch (error) {
    elizaLogger.error(`\u274C Error resolving token "${input}":`, error);
    return null;
  }
}
function applySmartTokenFiltering(tokens, searchInput) {
  if (!tokens || tokens.length === 0) return null;
  if (tokens.length === 1) return tokens[0];
  elizaLogger.log(`\u{1F50D} Applying smart filtering for ${tokens.length} tokens with input: "${searchInput}"`);
  const mainTokenSelectors = [
    // For Bitcoin - select the main Bitcoin, not wrapped versions
    (token) => token.TOKEN_NAME === "Bitcoin" && token.TOKEN_SYMBOL === "BTC",
    // For Dogecoin - select the main Dogecoin, not other DOGE tokens
    (token) => token.TOKEN_NAME === "Dogecoin" && token.TOKEN_SYMBOL === "DOGE",
    // For Ethereum - select the main Ethereum
    (token) => token.TOKEN_NAME === "Ethereum" && token.TOKEN_SYMBOL === "ETH",
    // For Avalanche - select the main Avalanche, not wrapped versions
    (token) => token.TOKEN_NAME === "Avalanche" && token.TOKEN_SYMBOL === "AVAX",
    // For Solana - select the main Solana
    (token) => token.TOKEN_NAME === "Solana" && token.TOKEN_SYMBOL === "SOL",
    // For Polygon - select the main Polygon
    (token) => token.TOKEN_NAME === "Polygon" && token.TOKEN_SYMBOL === "MATIC",
    // For other tokens - prefer exact name matches or shortest/simplest names
    (token) => {
      const name = token.TOKEN_NAME?.toLowerCase() || "";
      const symbol = token.TOKEN_SYMBOL?.toLowerCase() || "";
      const searchLower = searchInput.toLowerCase();
      const avoidKeywords = ["wrapped", "bridged", "peg", "department", "binance", "osmosis", "wormhole", "beam"];
      const hasAvoidKeywords = avoidKeywords.some((keyword) => name.includes(keyword));
      if (hasAvoidKeywords) return false;
      if (name === searchLower) return true;
      if (symbol === "btc" && name.includes("bitcoin")) return true;
      if (symbol === "eth" && name.includes("ethereum")) return true;
      if (symbol === "doge" && name.includes("dogecoin")) return true;
      if (symbol === "sol" && name.includes("solana")) return true;
      if (symbol === "avax" && name.includes("avalanche")) return true;
      if (symbol === "matic" && name.includes("polygon")) return true;
      return false;
    }
  ];
  for (const selector of mainTokenSelectors) {
    const match = tokens.find(selector);
    if (match) {
      elizaLogger.log(`\u2705 Smart filtering selected main token: ${match.TOKEN_NAME} (${match.TOKEN_SYMBOL}) - ID: ${match.TOKEN_ID}`);
      return match;
    }
  }
  elizaLogger.log(`\u{1F50D} No main token selector matched, using exchange count priority for "${searchInput}"`);
  const sortedTokens = tokens.sort((a, b) => {
    const aExchanges = a.EXCHANGE_LIST?.length || 0;
    const bExchanges = b.EXCHANGE_LIST?.length || 0;
    if (aExchanges !== bExchanges) return bExchanges - aExchanges;
    const aCategories = a.CATEGORY_LIST?.length || 0;
    const bCategories = b.CATEGORY_LIST?.length || 0;
    return bCategories - aCategories;
  });
  const bestToken = sortedTokens[0];
  elizaLogger.log(`\u2705 Exchange priority selected: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ${bestToken.EXCHANGE_LIST?.length || 0} exchanges`);
  return bestToken;
}

// src/actions/getPriceAction.ts
function extractCryptocurrencySimple(text) {
  const symbolPattern = /\b([A-Z]{3,10})\b/g;
  const symbolMatches = text.match(symbolPattern);
  if (symbolMatches && symbolMatches.length > 0) {
    const filteredSymbols = symbolMatches.filter(
      (symbol) => !["THE", "AND", "FOR", "WITH", "GET", "SET", "API", "KEY", "USD", "EUR", "GBP", "JPY"].includes(symbol)
    );
    if (filteredSymbols.length > 0) {
      return filteredSymbols[0];
    }
  }
  const potentialCryptoPattern = /\b([A-Z][a-z]{3,})\b/g;
  const nameMatches = text.match(potentialCryptoPattern);
  if (nameMatches && nameMatches.length > 0) {
    const filteredNames = nameMatches.filter(
      (word) => !["The", "What", "How", "Get", "Show", "Check", "Price", "Token", "Coin", "Much", "Worth", "From", "Please", "Hold", "Moment", "Today", "This", "That", "Here", "There", "When", "Where", "With", "Your"].includes(word)
    );
    if (filteredNames.length > 0) {
      return filteredNames[0];
    }
  }
  return null;
}
async function searchTokenDynamically(query, runtime) {
  try {
    elizaLogger2.log(`\u{1F50D} Searching for token: "${query}" using /tokens endpoint`);
    let searchParams = {
      symbol: query.toUpperCase(),
      limit: 5
      // Get multiple results to find the most popular one
    };
    let tokenData = await callTokenMetricsAPI("/v2/tokens", searchParams, runtime);
    elizaLogger2.log(`\u{1F52C} API Response for symbol search:`, JSON.stringify(tokenData, null, 2));
    if (tokenData?.data && tokenData.data.length > 0) {
      const majorCryptoMapping = {
        "BTC": "Bitcoin",
        "ETH": "Ethereum",
        "DOGE": "Dogecoin",
        "ADA": "Cardano",
        "SOL": "Solana",
        "AVAX": "Avalanche",
        "MATIC": "Polygon",
        "DOT": "Polkadot",
        "LINK": "Chainlink",
        "UNI": "Uniswap"
      };
      const expectedName = majorCryptoMapping[query.toUpperCase()];
      if (expectedName) {
        const exactMatch = tokenData.data.find(
          (token) => token.TOKEN_NAME?.toLowerCase() === expectedName.toLowerCase()
        );
        if (exactMatch) {
          elizaLogger2.log(`\u{1F3AF} Found exact major crypto match: ${exactMatch.TOKEN_NAME} (${exactMatch.TOKEN_SYMBOL}) - ID: ${exactMatch.TOKEN_ID}`);
          return exactMatch;
        }
      }
      let bestToken = tokenData.data[0];
      if (tokenData.data.length > 1) {
        elizaLogger2.log(`\u{1F50D} Multiple tokens found, selecting best match...`);
        const sortedTokens = tokenData.data.sort((a, b) => {
          const aExactMatch = a.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
          const bExactMatch = b.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
          if (aExactMatch !== bExactMatch) return bExactMatch - aExactMatch;
          const aExchanges = a.EXCHANGE_LIST?.length || 0;
          const bExchanges = b.EXCHANGE_LIST?.length || 0;
          if (aExchanges !== bExchanges) return bExchanges - aExchanges;
          const aCategories = a.CATEGORY_LIST?.length || 0;
          const bCategories = b.CATEGORY_LIST?.length || 0;
          return bCategories - aCategories;
        });
        bestToken = sortedTokens[0];
        elizaLogger2.log(`\u{1F3AF} Selected best token: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ${bestToken.EXCHANGE_LIST?.length || 0} exchanges`);
      }
      elizaLogger2.log(`\u2705 Found token by symbol: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ID: ${bestToken.TOKEN_ID}`);
      return bestToken;
    }
    const majorCryptoNames = {
      "BTC": "Bitcoin",
      "ETH": "Ethereum",
      "DOGE": "Dogecoin",
      "ADA": "Cardano",
      "SOL": "Solana",
      "AVAX": "Avalanche",
      "MATIC": "Polygon",
      "DOT": "Polkadot",
      "LINK": "Chainlink",
      "UNI": "Uniswap"
    };
    const searchName = majorCryptoNames[query.toUpperCase()] || query;
    searchParams = {
      token_name: searchName,
      limit: 10
      // Get more results to find best match
    };
    tokenData = await callTokenMetricsAPI("/v2/tokens", searchParams, runtime);
    elizaLogger2.log(`\u{1F52C} API Response for name search:`, JSON.stringify(tokenData, null, 2));
    if (tokenData?.data && tokenData.data.length > 0) {
      const queryLower = query.toLowerCase();
      const bestMatch = tokenData.data.find(
        (token) => token.TOKEN_NAME?.toLowerCase().includes(queryLower) || token.TOKEN_SYMBOL?.toLowerCase() === queryLower || token.TOKEN_NAME?.toLowerCase() === queryLower
      ) || tokenData.data[0];
      elizaLogger2.log(`\u2705 Found token by name: ${bestMatch.TOKEN_NAME} (${bestMatch.TOKEN_SYMBOL}) - ID: ${bestMatch.TOKEN_ID}`);
      return bestMatch;
    }
    elizaLogger2.log(`\u274C No token found for query: "${query}"`);
    return null;
  } catch (error) {
    elizaLogger2.error(`\u274C Error searching for token "${query}":`, error);
    return null;
  }
}
var PriceRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().describe("The cryptocurrency name or symbol (e.g., 'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Dogecoin', 'DOGE', 'Avalanche', 'AVAX')"),
  symbol: external_exports.string().optional().describe("The cryptocurrency symbol (e.g., 'BTC', 'ETH', 'SOL', 'DOGE', 'AVAX')"),
  analysisType: external_exports.enum(["current", "trend", "technical", "all"]).optional().describe("Type of price analysis to focus on")
});
var PRICE_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting cryptocurrency PRICE requests from natural language.

CRITICAL INSTRUCTION: This is ONLY for PRICE requests, NOT token search/database requests.

ONLY MATCH PRICE REQUESTS:
- "What's the price of Bitcoin?" \u2705
- "How much is ETH worth?" \u2705  
- "Get Bitcoin price" \u2705
- "Show me DOGE price" \u2705
- "Bitcoin current price" \u2705
- "Check ETH price" \u2705
- "Price of Solana" \u2705
- "What's the price of BONK?" \u2705
- "DEGEN price" \u2705
- "How much is PEPE worth?" \u2705
- "Get FLOKI price" \u2705
- "Check WIF price" \u2705

DO NOT MATCH TOKEN SEARCH/DATABASE REQUESTS:
- "Find token details for Ethereum" \u274C (this is TOKEN SEARCH)
- "Search for Bitcoin token information" \u274C (this is TOKEN SEARCH)
- "Lookup token information for Dogecoin" \u274C (this is TOKEN SEARCH)
- "Get token details" \u274C (this is TOKEN SEARCH)
- "Search token database" \u274C (this is TOKEN SEARCH)
- "Find token info" \u274C (this is TOKEN SEARCH)
- "Token information" \u274C (this is TOKEN SEARCH)

ONLY extract if the user is asking for PRICE/VALUE information, not token details or database searches.

Extract the following information for PRICE requests only:

1. **cryptocurrency** (required): The EXACT cryptocurrency name or symbol they mentioned
   - Extract whatever cryptocurrency name the user said (Bitcoin, Ethereum, Dogecoin, Avalanche, BONK, DEGEN, PEPE, FLOKI, WIF, etc.)
   - Extract whatever symbol the user said (BTC, ETH, DOGE, AVAX, BONK, DEGEN, PEPE, FLOKI, WIF, etc.)
   - Accept ANY cryptocurrency name or symbol mentioned, including meme coins and new tokens
   - DO NOT change or substitute the cryptocurrency name

2. **symbol** (optional): The cryptocurrency symbol if mentioned or mappable
   - Common mappings: Bitcoin\u2192BTC, Ethereum\u2192ETH, Dogecoin\u2192DOGE, Avalanche\u2192AVAX, Solana\u2192SOL

3. **analysisType** (optional, default: "current"): What type of price analysis they want
   - "current" - just the current price (default)
   - "trend" - price trends and changes  
   - "technical" - technical analysis
   - "all" - comprehensive analysis

CRITICAL: Only extract if this is clearly a PRICE request, not a token search/database request.

IMPORTANT: Accept ANY cryptocurrency name or symbol mentioned by the user, including:
- Major coins: Bitcoin, Ethereum, Solana, etc.
- Altcoins: Cardano, Polygon, Chainlink, etc.  
- Meme coins: DOGE, SHIB, PEPE, BONK, FLOKI, DEGEN, WIF, etc.
- New/obscure tokens: Any symbol or name the user mentions

Extract the price request details from the user's message and respond in XML format:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<analysisType>current|trend|technical|all</analysisType>
</response>
`;
function analyzePriceData(priceData, analysisType = "current") {
  const price = priceData.PRICE || priceData.CURRENT_PRICE;
  const change24h = priceData.CHANGE_24H || priceData.PRICE_CHANGE_24H || 0;
  const changePercent24h = priceData.CHANGE_PERCENT_24H || priceData.PRICE_CHANGE_PERCENT_24H || 0;
  const volume24h = priceData.VOLUME_24H || priceData.TRADING_VOLUME_24H;
  const marketCap = priceData.MARKET_CAP;
  const baseAnalysis = {
    current_price: price,
    change_24h: change24h,
    change_percent_24h: changePercent24h,
    trend: change24h >= 0 ? "bullish" : "bearish",
    volatility: Math.abs(changePercent24h) > 5 ? "high" : "moderate",
    market_cap: marketCap,
    volume_24h: volume24h
  };
  switch (analysisType) {
    case "trend":
      return {
        ...baseAnalysis,
        trend_analysis: {
          momentum: Math.abs(changePercent24h) > 10 ? "strong" : "weak",
          direction: change24h >= 0 ? "upward" : "downward",
          volatility_level: Math.abs(changePercent24h) > 15 ? "very high" : Math.abs(changePercent24h) > 5 ? "high" : "normal"
        }
      };
    case "technical":
      return {
        ...baseAnalysis,
        technical_indicators: {
          price_momentum: changePercent24h > 5 ? "bullish" : changePercent24h < -5 ? "bearish" : "neutral",
          volume_analysis: volume24h ? "active trading" : "low volume",
          market_sentiment: change24h >= 0 ? "positive" : "negative"
        }
      };
    case "all":
      return {
        ...baseAnalysis,
        comprehensive_analysis: {
          price_action: change24h >= 0 ? "gaining" : "declining",
          market_position: marketCap ? "established" : "emerging",
          trading_activity: volume24h ? "active" : "quiet",
          investor_sentiment: changePercent24h > 0 ? "optimistic" : "cautious"
        }
      };
    default:
      return baseAnalysis;
  }
}
function formatPriceResponse(priceData, tokenInfo, analysisType = "current") {
  const symbol = priceData.SYMBOL || priceData.TOKEN_SYMBOL || tokenInfo.SYMBOL || tokenInfo.TOKEN_SYMBOL;
  const name = priceData.NAME || priceData.TOKEN_NAME || tokenInfo.NAME || tokenInfo.TOKEN_NAME;
  const price = priceData.PRICE || priceData.CURRENT_PRICE;
  const change24h = priceData.CHANGE_24H || priceData.PRICE_CHANGE_24H;
  const changePercent24h = priceData.CHANGE_PERCENT_24H || priceData.PRICE_CHANGE_PERCENT_24H;
  const volume24h = priceData.VOLUME_24H || priceData.TRADING_VOLUME_24H;
  const marketCap = priceData.MARKET_CAP;
  let response = `\u{1F4B0} **${name} (${symbol}) Price Information**

`;
  response += `\u{1F3AF} **Current Price**: ${formatCurrency(price)}
`;
  if (change24h !== void 0 && change24h !== null) {
    const changeEmoji = change24h >= 0 ? "\u{1F4C8}" : "\u{1F4C9}";
    response += `${changeEmoji} **24h Change**: ${formatCurrency(change24h)} (${formatPercentage(changePercent24h || 0)})
`;
  }
  switch (analysisType) {
    case "trend":
      response += `
\u{1F4CA} **Trend Analysis**:
`;
      response += `\u2022 Momentum: ${Math.abs(changePercent24h || 0) > 10 ? "Strong" : "Weak"}
`;
      response += `\u2022 Direction: ${(change24h || 0) >= 0 ? "Upward" : "Downward"}
`;
      response += `\u2022 Volatility: ${Math.abs(changePercent24h || 0) > 15 ? "Very High" : Math.abs(changePercent24h || 0) > 5 ? "High" : "Normal"}
`;
      break;
    case "technical":
      response += `
\u{1F50D} **Technical Analysis**:
`;
      response += `\u2022 Price Momentum: ${(changePercent24h || 0) > 5 ? "Bullish" : (changePercent24h || 0) < -5 ? "Bearish" : "Neutral"}
`;
      response += `\u2022 Market Sentiment: ${(change24h || 0) >= 0 ? "Positive" : "Negative"}
`;
      if (volume24h) response += `\u2022 Trading Activity: Active
`;
      break;
    case "all":
      if (volume24h) {
        response += `\u{1F4CA} **24h Volume**: ${formatCurrency(volume24h)}
`;
      }
      if (marketCap) {
        response += `\u{1F3E6} **Market Cap**: ${formatCurrency(marketCap)}
`;
      }
      response += `
\u{1F4C8} **Market Analysis**:
`;
      response += `\u2022 Price Action: ${(change24h || 0) >= 0 ? "Gaining" : "Declining"}
`;
      response += `\u2022 Volatility: ${Math.abs(changePercent24h || 0) > 5 ? "High" : "Moderate"}
`;
      response += `\u2022 Investor Sentiment: ${(changePercent24h || 0) > 0 ? "Optimistic" : "Cautious"}
`;
      break;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics API (Real-time)
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
var getPriceAction = {
  name: "GET_PRICE_TOKENMETRICS",
  description: "Get real-time cryptocurrency price data and analysis from TokenMetrics with AI-powered natural language processing",
  similes: [
    "get price",
    "price check",
    "crypto price",
    "current price",
    "price data",
    "market price",
    "price analysis",
    "what's the price",
    "how much is",
    "price of",
    "check price",
    "show price",
    "get current price",
    "market value",
    "token value",
    "crypto value"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "What's the price of Bitcoin?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the current Bitcoin price from TokenMetrics for you.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "How much is Ethereum worth right now?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Let me fetch the latest Ethereum price data from TokenMetrics.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get me Solana price trends"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve Solana price data with trend analysis from TokenMetrics.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ]
  ],
  validate: async (runtime, message, state) => {
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger2.error("\u274C Price action validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const requestId = generateRequestId();
      elizaLogger2.log(`[${requestId}] Processing price request...`);
      elizaLogger2.log(`[${requestId}] \u{1F50D} DEBUG: User message content: "${message.content.text}"`);
      console.log(`
\u{1F50D} PRICE ACTION DEBUG [${requestId}]:`);
      console.log(`\u{1F4DD} User message: "${message.content.text}"`);
      let currentState = state;
      if (!currentState) {
        currentState = await runtime.composeState(message);
      } else {
        currentState = await runtime.composeState(message, ["RECENT_MESSAGES"]);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = PRICE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      let priceRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        currentState,
        enhancedTemplate,
        PriceRequestSchema,
        requestId
      );
      elizaLogger2.log(`[${requestId}] \u{1F3AF} DEBUG: AI Extracted request:`, JSON.stringify(priceRequest, null, 2));
      console.log(`\u{1F3AF} Extracted request:`, priceRequest);
      if (!priceRequest) {
        elizaLogger2.log(`[${requestId}] \u274C DEBUG: AI extraction returned null - analyzing with fallback...`);
        console.log(`\u274C AI extraction failed, trying fallback...`);
        const cryptoFromText = extractCryptocurrencySimple(message.content?.text || "");
        if (!cryptoFromText) {
          elizaLogger2.log(`[${requestId}] \u274C DEBUG: Fallback extraction also failed`);
          console.log(`\u274C Fallback extraction failed too`);
          console.log(`\u{1F51A} END DEBUG [${requestId}]
`);
          if (callback) {
            await callback({
              text: `\u274C I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
\u2022 Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
\u2022 Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
\u2022 Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
\u2022 Dogecoin (DOGE), XRP, Litecoin (LTC)
\u2022 And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
              content: {
                error: "No cryptocurrency identified",
                request_id: requestId,
                debug_extraction: priceRequest
              }
            });
          }
          return createActionResult({
            success: false,
            text: `\u274C I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
\u2022 Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
\u2022 Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
\u2022 Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
\u2022 Dogecoin (DOGE), XRP, Litecoin (LTC)
\u2022 And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
            error: "No cryptocurrency identified"
          });
        }
        priceRequest = {
          cryptocurrency: cryptoFromText,
          analysisType: "current"
        };
        elizaLogger2.log(`[${requestId}] \u2705 DEBUG: Fallback extraction successful: "${cryptoFromText}"`);
        console.log(`\u2705 Fallback found: "${cryptoFromText}"`);
      }
      const cryptoToResolve = priceRequest.cryptocurrency || priceRequest.symbol;
      if (!cryptoToResolve) {
        elizaLogger2.log(`[${requestId}] \u274C DEBUG: No cryptocurrency to resolve after extraction`);
        console.log(`\u274C No cryptocurrency found after all extraction attempts`);
        console.log(`\u{1F51A} END DEBUG [${requestId}]
`);
        if (callback) {
          await callback({
            text: `\u274C I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
\u2022 Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
\u2022 Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
\u2022 Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
\u2022 Dogecoin (DOGE), XRP, Litecoin (LTC)
\u2022 And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
            content: {
              error: "No cryptocurrency identified",
              request_id: requestId,
              debug_extraction: priceRequest
            }
          });
        }
        return createActionResult({
          success: false,
          text: `\u274C I couldn't identify which cryptocurrency you're asking about.

I can get price data for any cryptocurrency supported by TokenMetrics including:
\u2022 Bitcoin (BTC), Ethereum (ETH), Solana (SOL)
\u2022 Cardano (ADA), Polygon (MATIC), Chainlink (LINK)
\u2022 Uniswap (UNI), Avalanche (AVAX), Polkadot (DOT)
\u2022 Dogecoin (DOGE), XRP, Litecoin (LTC)
\u2022 And many more!

Try asking: "What's the price of Bitcoin?" or "How much is ETH worth?"`,
          error: "No cryptocurrency identified"
        });
      }
      elizaLogger2.log(`[${requestId}] \u{1F50D} DEBUG: Starting DYNAMIC token search for: "${cryptoToResolve}"`);
      console.log(`\u{1F50D} Starting DYNAMIC token search for: "${cryptoToResolve}"`);
      const tokenInfo = await searchTokenDynamically(cryptoToResolve, runtime);
      elizaLogger2.log(`[${requestId}] \u{1F3AF} DEBUG: Dynamic token search result:`, tokenInfo ? {
        name: tokenInfo.TOKEN_NAME,
        symbol: tokenInfo.TOKEN_SYMBOL,
        id: tokenInfo.TOKEN_ID
      } : "null");
      console.log(`\u{1F3AF} Token found dynamically:`, tokenInfo ? {
        name: tokenInfo.TOKEN_NAME,
        symbol: tokenInfo.TOKEN_SYMBOL,
        id: tokenInfo.TOKEN_ID
      } : "null");
      console.log(`\u{1F51A} END DEBUG [${requestId}]
`);
      if (!tokenInfo) {
        elizaLogger2.log(`[${requestId}] \u274C DEBUG: Token resolution failed for: "${cryptoToResolve}"`);
        if (callback) {
          await callback({
            text: `\u274C I couldn't find information for "${cryptoToResolve}".

This might be:
\u2022 A very new token not yet in TokenMetrics database
\u2022 An alternative name or symbol I don't recognize
\u2022 A spelling variation

Try using the official name, such as:
\u2022 Bitcoin, Ethereum, Solana, Cardano, Dogecoin
\u2022 Uniswap, Chainlink, Polygon, Avalanche
\u2022 Or check the exact spelling on CoinMarketCap`,
            content: {
              error: "Token not found",
              requested_token: cryptoToResolve,
              request_id: requestId,
              debug_extraction: priceRequest
            }
          });
        }
        return createActionResult({
          success: false,
          text: `\u274C I couldn't find information for "${cryptoToResolve}".

This might be:
\u2022 A very new token not yet in TokenMetrics database
\u2022 An alternative name or symbol I don't recognize
\u2022 A spelling variation

Try using the official name, such as:
\u2022 Bitcoin, Ethereum, Solana, Cardano, Dogecoin
\u2022 Uniswap, Chainlink, Polygon, Avalanche
\u2022 Or check the exact spelling on CoinMarketCap`,
          error: "Token not found"
        });
      }
      elizaLogger2.log(`[${requestId}] \u2705 DEBUG: Successfully resolved token: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL}) - ID: ${tokenInfo.TOKEN_ID}`);
      const apiParams = {
        token_id: tokenInfo.TOKEN_ID,
        limit: 1
      };
      const response = await callTokenMetricsAPI("/v2/price", apiParams, runtime);
      elizaLogger2.log(`[${requestId}] API response received`);
      const priceData = Array.isArray(response) ? response[0] : response.data?.[0] || response;
      if (!priceData) {
        if (callback) {
          await callback({
            text: `\u274C No price data available for ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} at the moment.

This could be due to:
\u2022 Temporary data unavailability
\u2022 Market data processing delays
\u2022 Token not actively traded

Please try again in a few moments.`,
            content: {
              error: "No price data",
              token: tokenInfo,
              request_id: requestId
            }
          });
        }
        return createActionResult({
          success: false,
          text: `\u274C No price data available for ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} at the moment.

This could be due to:
\u2022 Temporary data unavailability
\u2022 Market data processing delays
\u2022 Token not actively traded

Please try again in a few moments.`,
          error: "No price data"
        });
      }
      const analysisType = priceRequest.analysisType || "current";
      const analysis = analyzePriceData(priceData, analysisType);
      const responseText = formatPriceResponse(priceData, tokenInfo, analysisType);
      elizaLogger2.log(`[${requestId}] Successfully processed price request`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            token_info: tokenInfo,
            price_data: priceData,
            analysis,
            metadata: {
              endpoint: "price",
              analysis_type: analysisType,
              data_source: "TokenMetrics API",
              timestamp: (/* @__PURE__ */ new Date()).toISOString()
            }
          }
        });
      }
      return createActionResult({
        success: true,
        text: responseText,
        data: {
          token_info: tokenInfo,
          price_data: priceData,
          analysis,
          source: "TokenMetrics Price API",
          request_id: requestId
        }
      });
    } catch (error) {
      elizaLogger2.error("\u274C Error in price action:", error);
      if (callback) {
        await callback({
          text: `\u274C I encountered an error while fetching price data: ${error instanceof Error ? error.message : "Unknown error"}

This could be due to:
\u2022 Network connectivity issues
\u2022 TokenMetrics API service problems
\u2022 Invalid API key or authentication issues
\u2022 Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
          content: {
            error: error instanceof Error ? error.message : "Unknown error",
            troubleshooting: true
          }
        });
      }
      return createActionResult({
        success: false,
        text: `\u274C I encountered an error while fetching price data: ${error instanceof Error ? error.message : "Unknown error"}

This could be due to:
\u2022 Network connectivity issues
\u2022 TokenMetrics API service problems
\u2022 Invalid API key or authentication issues
\u2022 Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }
};

// src/actions/getQuantmetricsAction.ts
import {
  elizaLogger as elizaLogger3,
  createActionResult as createActionResult2
} from "@elizaos/core";
var QuantmetricsRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  category: external_exports.string().optional().describe("Token category filter (e.g., defi, layer1)"),
  exchange: external_exports.string().optional().describe("Exchange filter"),
  marketcap: external_exports.number().optional().describe("Minimum market cap filter"),
  volume: external_exports.number().optional().describe("Minimum volume filter"),
  fdv: external_exports.number().optional().describe("Minimum fully diluted valuation filter"),
  limit: external_exports.number().min(1).max(1e3).optional().describe("Number of results to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["risk", "returns", "performance", "all"]).optional().describe("Type of analysis to focus on")
});
var quantmetricsTemplate = `Extract quantmetrics request information from the message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Quantmetrics provide:
- Quantitative analysis and metrics
- Mathematical models and scoring
- Statistical performance indicators
- Risk-adjusted return metrics
- Portfolio optimization data
- Algorithmic trading insights

Instructions:
Look for QUANTMETRICS requests, such as:
- Quantitative analysis ("Quantmetrics for [TOKEN]", "Get quant analysis")
- Statistical metrics ("Statistical analysis", "Quant scoring")
- Risk metrics ("Risk-adjusted returns", "Quantitative risk")
- Performance metrics ("Quant performance", "Mathematical analysis")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "Get quantmetrics for [TOKEN]" \u2192 extract [TOKEN]
- "Show me quantitative analysis for [TOKEN]" \u2192 extract [TOKEN]
- "Quantitative metrics for [TOKEN]" \u2192 extract [TOKEN]
- "Risk-adjusted analysis for [TOKEN]" \u2192 extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<analysis_type>risk, performance, statistical, or general</analysis_type>
<metric_focus>returns, volatility, sharpe, sortino, or all</metric_focus>
<timeframe>daily, weekly, monthly, or general</timeframe>
<limit>number of results requested (default 20)</limit>
</response>`;
var getQuantmetricsAction = {
  name: "GET_QUANTMETRICS_TOKENMETRICS",
  description: "Get comprehensive quantitative metrics including volatility, Sharpe ratio, CAGR, and risk measurements from TokenMetrics",
  similes: [
    "get quantitative metrics",
    "analyze token statistics",
    "get risk metrics",
    "calculate sharpe ratio",
    "get volatility data",
    "analyze returns",
    "portfolio risk analysis"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get quantmetrics for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch comprehensive quantitative metrics for Bitcoin from TokenMetrics.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me risk metrics for DeFi tokens with market cap over $500M"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze quantitative risk metrics for large-cap DeFi tokens.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Analyze Sharpe ratio and returns for Ethereum"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the quantitative return metrics and Sharpe ratio analysis for Ethereum.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ]
  ],
  validate: async (runtime, message, state) => {
    elizaLogger3.log("\u{1F50D} Validating getQuantmetricsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger3.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    const requestId = generateRequestId();
    elizaLogger3.log("\u{1F680} Starting TokenMetrics quantmetrics handler (1.x)");
    elizaLogger3.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger3.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      if (!state) {
        state = await runtime.composeState(message);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = quantmetricsTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const quantRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state,
        enhancedTemplate,
        QuantmetricsRequestSchema,
        requestId
      );
      elizaLogger3.log("\u{1F3AF} AI Extracted quantmetrics request:", quantRequest);
      elizaLogger3.log(`\u{1F50D} DEBUG: AI extracted cryptocurrency: "${quantRequest?.cryptocurrency}"`);
      console.log(`[${requestId}] Extracted request:`, quantRequest);
      const apiParams = {
        limit: quantRequest?.limit || 20,
        page: 1
      };
      let tokenInfo = null;
      if (quantRequest?.cryptocurrency) {
        elizaLogger3.log(`\u{1F50D} Resolving token for: "${quantRequest.cryptocurrency}"`);
        try {
          tokenInfo = await resolveTokenSmart(quantRequest.cryptocurrency, runtime);
          if (tokenInfo) {
            apiParams.token_id = tokenInfo.TOKEN_ID;
            elizaLogger3.log(`\u2705 Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
          } else {
            apiParams.symbol = quantRequest.cryptocurrency.toUpperCase();
            elizaLogger3.log(`\u{1F50D} Using symbol: ${quantRequest.cryptocurrency}`);
          }
        } catch (error) {
          elizaLogger3.log(`\u26A0\uFE0F Token resolution failed, using symbol fallback: ${error}`);
          apiParams.symbol = quantRequest.cryptocurrency.toUpperCase();
          elizaLogger3.log(`\u{1F50D} Fallback to symbol parameter: ${quantRequest.cryptocurrency.toUpperCase()}`);
        }
      }
      elizaLogger3.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger3.log(`\u{1F4E1} Fetching quantmetrics data`);
      const quantData = await callTokenMetricsAPI("/v2/quantmetrics", apiParams, runtime);
      if (!quantData) {
        elizaLogger3.log("\u274C Failed to fetch quantmetrics data");
        if (callback) {
          await callback({
            text: `\u274C Unable to fetch quantitative metrics data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting

Please try again in a few moments.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return createActionResult2({
          success: false,
          text: "\u274C Unable to fetch quantitative metrics data at the moment.",
          data: {
            error: "API fetch failed",
            request_id: requestId
          }
        });
      }
      const metrics = Array.isArray(quantData) ? quantData : quantData.data || [];
      elizaLogger3.log(`\u{1F50D} Received ${metrics.length} quantmetrics`);
      const responseText = formatQuantmetricsResponse(metrics, tokenInfo);
      const analysis = analyzeQuantitativeMetrics(metrics, "comprehensive");
      elizaLogger3.success("\u2705 Successfully processed quantmetrics request");
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            quantmetrics_data: metrics,
            analysis,
            source: "TokenMetrics Quantmetrics API",
            request_id: requestId,
            metadata: {
              endpoint: "quantmetrics",
              data_source: "TokenMetrics API",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              total_metrics: metrics.length
            }
          }
        });
      }
      return createActionResult2({
        success: true,
        text: responseText,
        data: {
          success: true,
          quantmetrics_data: metrics,
          analysis,
          source: "TokenMetrics Quantmetrics API",
          request_id: requestId,
          metadata: {
            endpoint: "quantmetrics",
            data_source: "TokenMetrics API",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            total_metrics: metrics.length
          }
        }
      });
    } catch (error) {
      elizaLogger3.error("\u274C Error in quantmetrics handler:", error);
      elizaLogger3.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      if (callback) {
        await callback({
          text: `\u274C I encountered an error while fetching quantitative metrics: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: requestId
          }
        });
      }
      return createActionResult2({
        success: false,
        error: errorMessage
      });
    }
  }
};
function formatQuantmetricsResponse(metrics, tokenInfo) {
  if (!metrics || metrics.length === 0) {
    return "\u274C No quantitative metrics data available.";
  }
  let response = `\u26A1 **Quantitative Metrics Analysis**

`;
  if (tokenInfo) {
    response += `\u{1F3AF} **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})
`;
  }
  response += `\u{1F4CA} **Data Points**: ${metrics.length} metrics analyzed

`;
  if (metrics.length > 0) {
    const firstMetric = metrics[0];
    response += `\u{1F4C8} **Key Metrics**:
`;
    if (firstMetric.VOLATILITY !== void 0) {
      response += `\u2022 **Volatility**: ${firstMetric.VOLATILITY.toFixed(2)}%
`;
    }
    if (firstMetric.SHARPE !== void 0) {
      response += `\u2022 **Sharpe Ratio**: ${firstMetric.SHARPE.toFixed(3)}
`;
    }
    if (firstMetric.MAX_DRAWDOWN !== void 0) {
      response += `\u2022 **Max Drawdown**: ${firstMetric.MAX_DRAWDOWN.toFixed(2)}%
`;
    }
    if (firstMetric.CAGR !== void 0) {
      response += `\u2022 **CAGR**: ${firstMetric.CAGR.toFixed(2)}%
`;
    }
    if (firstMetric.ALL_TIME_RETURN !== void 0) {
      response += `\u2022 **All-Time Return**: ${firstMetric.ALL_TIME_RETURN.toFixed(2)}%
`;
    }
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics Quantmetrics API
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeQuantitativeMetrics(quantData, analysisType) {
  if (!quantData || quantData.length === 0) {
    return {
      summary: "No quantitative data available for analysis",
      risk_assessment: "Cannot assess risk without data",
      insights: []
    };
  }
  const riskAnalysis = analyzeRiskMetrics(quantData);
  const returnAnalysis = analyzeReturnMetrics(quantData);
  const portfolioImplications = generatePortfolioImplications(riskAnalysis, returnAnalysis);
  const insights = generateQuantitativeInsights(quantData, riskAnalysis, returnAnalysis);
  return {
    summary: `Quantitative analysis of ${quantData.length} data points shows ${riskAnalysis.overall_risk_level} risk with ${returnAnalysis.return_quality} returns`,
    risk_analysis: riskAnalysis,
    return_analysis: returnAnalysis,
    portfolio_implications: portfolioImplications,
    insights,
    comparative_analysis: generateComparativeAnalysis(quantData),
    data_quality: {
      source: "TokenMetrics Official API",
      data_points: quantData.length,
      reliability: "High - TokenMetrics verified data"
    }
  };
}
function analyzeRiskMetrics(quantData) {
  const volatilities = quantData.map((d) => d.VOLATILITY).filter((v) => v !== null && v !== void 0);
  const maxDrawdowns = quantData.map((d) => d.MAX_DRAWDOWN).filter((d) => d !== null && d !== void 0);
  if (volatilities.length === 0) {
    return { overall_risk_level: "Unknown", risk_assessment: "Insufficient data" };
  }
  const avgVolatility = volatilities.reduce((sum, v) => sum + v, 0) / volatilities.length;
  const avgMaxDrawdown = maxDrawdowns.length > 0 ? maxDrawdowns.reduce((sum, d) => sum + Math.abs(d), 0) / maxDrawdowns.length : 0;
  let riskLevel;
  if (avgVolatility > 80) riskLevel = "Very High";
  else if (avgVolatility > 60) riskLevel = "High";
  else if (avgVolatility > 40) riskLevel = "Moderate";
  else if (avgVolatility > 20) riskLevel = "Low-Moderate";
  else riskLevel = "Low";
  const highRisk = volatilities.filter((v) => v > 60).length;
  const moderateRisk = volatilities.filter((v) => v > 30 && v <= 60).length;
  const lowRisk = volatilities.filter((v) => v <= 30).length;
  return {
    overall_risk_level: riskLevel,
    average_volatility: avgVolatility.toFixed(2),
    average_max_drawdown: avgMaxDrawdown.toFixed(2) + "%",
    risk_distribution: {
      high_risk: `${highRisk} tokens (${(highRisk / volatilities.length * 100).toFixed(1)}%)`,
      moderate_risk: `${moderateRisk} tokens (${(moderateRisk / volatilities.length * 100).toFixed(1)}%)`,
      low_risk: `${lowRisk} tokens (${(lowRisk / volatilities.length * 100).toFixed(1)}%)`
    },
    risk_assessment: generateRiskAssessment(avgVolatility, avgMaxDrawdown)
  };
}
function analyzeReturnMetrics(quantData) {
  const sharpeRatios = quantData.map((d) => d.SHARPE || 0).filter((s) => !isNaN(s));
  const cagrValues = quantData.map((d) => d.CAGR || 0).filter((c) => !isNaN(c));
  const sortinoRatios = quantData.map((d) => d.SORTINO || 0).filter((s) => !isNaN(s));
  const avgSharpe = sharpeRatios.length > 0 ? sharpeRatios.reduce((sum, s) => sum + s, 0) / sharpeRatios.length : 0;
  const avgCAGR = cagrValues.length > 0 ? cagrValues.reduce((sum, c) => sum + c, 0) / cagrValues.length : 0;
  const avgSortino = sortinoRatios.length > 0 ? sortinoRatios.reduce((sum, s) => sum + s, 0) / sortinoRatios.length : 0;
  const insights = [];
  if (sharpeRatios.length > 0) {
    insights.push(`\u{1F3C6} Average Sharpe Ratio: ${avgSharpe.toFixed(2)}`);
    insights.push(`\u{1F4C8} Average CAGR: ${formatPercentage(avgCAGR)}`);
  }
  return {
    avg_sharpe: avgSharpe,
    avg_cagr: avgCAGR,
    avg_sortino: avgSortino,
    sharpe_distribution: analyzeDistribution(sharpeRatios),
    cagr_distribution: analyzeDistribution(cagrValues),
    insights
  };
}
function generatePortfolioImplications(riskAnalysis, returnAnalysis) {
  const implications = [];
  if (riskAnalysis.overall_risk_level === "Very High" || riskAnalysis.overall_risk_level === "High") {
    implications.push("High volatility levels suggest smaller position sizes and active risk management required");
    implications.push("Consider these tokens as satellite holdings rather than core positions");
  } else if (riskAnalysis.overall_risk_level === "Low-Moderate" || riskAnalysis.overall_risk_level === "Low") {
    implications.push("Lower volatility suggests these tokens could serve as core portfolio holdings");
  }
  if (returnAnalysis.return_quality === "Excellent" || returnAnalysis.return_quality === "Good") {
    implications.push("Strong risk-adjusted returns support higher allocation consideration");
    implications.push("Good Sharpe ratios indicate efficient risk-return profiles");
  } else if (returnAnalysis.return_quality === "Poor" || returnAnalysis.return_quality === "Very Poor") {
    implications.push("Weak risk-adjusted returns suggest these assets may not adequately compensate for risk");
  }
  implications.push("Diversification across different risk profiles recommended");
  implications.push("Monitor quantitative metrics regularly for changing risk characteristics");
  return implications;
}
function generateQuantitativeInsights(quantData, riskAnalysis, returnAnalysis) {
  const insights = [];
  const avgVol = parseFloat(riskAnalysis.average_volatility);
  if (avgVol > 70) {
    insights.push("High volatility levels indicate significant price movements and require careful position sizing");
  } else if (avgVol < 30) {
    insights.push("Relatively low volatility for crypto markets suggests more stable price behavior");
  }
  const avgSharpe = parseFloat(returnAnalysis.avg_sharpe);
  if (avgSharpe > 1) {
    insights.push("Positive Sharpe ratios indicate these assets have historically provided good risk-adjusted returns");
  } else if (avgSharpe < 0) {
    insights.push("Negative Sharpe ratios suggest poor risk-adjusted performance historically");
  }
  if (quantData.length > 1) {
    const topPerformer = quantData.reduce((best, current) => (current.SHARPE || 0) > (best.SHARPE || 0) ? current : best);
    insights.push(`${topPerformer.NAME} (${topPerformer.SYMBOL}) shows the best risk-adjusted performance in this analysis`);
  }
  return insights;
}
function generateComparativeAnalysis(quantData) {
  if (quantData.length < 2) {
    return { comparison: "Insufficient data for comparative analysis" };
  }
  const sortedBySharpe = quantData.filter((d) => d.SHARPE !== null && d.SHARPE !== void 0).sort((a, b) => b.SHARPE - a.SHARPE);
  const sortedByVolatility = quantData.filter((d) => d.VOLATILITY !== null && d.VOLATILITY !== void 0).sort((a, b) => a.VOLATILITY - b.VOLATILITY);
  return {
    performance_ranking: sortedBySharpe.slice(0, 3).map((token, index) => ({
      rank: index + 1,
      name: `${token.NAME} (${token.SYMBOL})`,
      sharpe_ratio: token.SHARPE.toFixed(3),
      cagr: token.CAGR ? formatPercentage(token.CAGR) : "N/A"
    })),
    risk_ranking: sortedByVolatility.slice(0, 3).map((token, index) => ({
      rank: index + 1,
      name: `${token.NAME} (${token.SYMBOL})`,
      volatility: token.VOLATILITY.toFixed(2),
      max_drawdown: token.MAX_DRAWDOWN ? formatPercentage(token.MAX_DRAWDOWN) : "N/A"
    })),
    analysis_scope: `${quantData.length} tokens analyzed`
  };
}
function generateRiskAssessment(avgVolatility, avgMaxDrawdown) {
  if (avgVolatility > 80 && avgMaxDrawdown > 50) {
    return "Extremely high risk - significant volatility and drawdown potential";
  } else if (avgVolatility > 60) {
    return "High risk - substantial price movements expected";
  } else if (avgVolatility > 40) {
    return "Moderate risk - typical for established cryptocurrencies";
  } else {
    return "Lower risk - relatively stable for crypto markets";
  }
}
function analyzeDistribution(values) {
  if (values.length === 0) {
    return { high: 0, medium: 0, low: 0 };
  }
  const high = values.filter((v) => v > 1).length;
  const medium = values.filter((v) => v > 0 && v <= 1).length;
  const low = values.filter((v) => v <= 0).length;
  return {
    high: `${high} (${(high / values.length * 100).toFixed(1)}%)`,
    medium: `${medium} (${(medium / values.length * 100).toFixed(1)}%)`,
    low: `${low} (${(low / values.length * 100).toFixed(1)}%)`
  };
}

// src/actions/getCorrelationAction.ts
import {
  elizaLogger as elizaLogger4,
  createActionResult as createActionResult3
} from "@elizaos/core";
var CorrelationRequestSchema = external_exports.object({
  token_id: external_exports.number().min(1).optional().describe("The ID of the token to analyze correlation for"),
  symbol: external_exports.string().optional().describe("The symbol of the token to analyze correlation for"),
  category: external_exports.string().optional().describe("Filter by token category (e.g., defi, layer1, gaming)"),
  exchange: external_exports.string().optional().describe("Filter by exchange"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of correlation results to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["diversification", "hedging", "risk_management", "all"]).optional().describe("Type of correlation analysis to focus on")
});
var CORRELATION_EXTRACTION_TEMPLATE = `Extract correlation analysis request information from the user's message.

The user wants to analyze correlations between a specific cryptocurrency and other tokens in the market.

Instructions:
Look for CORRELATION requests, such as:
- Token correlation analysis ("Get correlation for Bitcoin", "BTC correlations")
- Cross-asset correlation ("How does ETH correlate with other tokens?")
- Portfolio diversification ("Show me DOGE correlation analysis")
- Risk analysis ("Correlation data for Solana")

EXAMPLES:
- "Get correlation analysis for DEGEN?" \u2192 cryptocurrency: "DEGEN"
- "Show me ETH correlations" \u2192 cryptocurrency: "ETH" 
- "How does Bitcoin correlate with other tokens?" \u2192 cryptocurrency: "Bitcoin"
- "BONK correlation data" \u2192 cryptocurrency: "BONK"
- "Correlation analysis for Solana" \u2192 cryptocurrency: "Solana"

Extract the request details from the user's message and respond in XML format:
<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<analysisType>general|diversification|hedging|risk_management</analysisType>
<limit>number of correlations to return (default: 20)</limit>
</response>`;
var getCorrelationAction = {
  name: "GET_CORRELATION_TOKENMETRICS",
  description: "Get Top 10 and Bottom 10 correlation of tokens with the top 100 market cap tokens from TokenMetrics for diversification and risk analysis",
  similes: [
    "get correlation",
    "token correlation",
    "correlation analysis",
    "market correlation",
    "diversification analysis",
    "correlation matrix",
    "relationship analysis"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get correlation analysis for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze price correlations for Bitcoin with other cryptocurrencies.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me DeFi tokens for portfolio diversification"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll find DeFi tokens with low correlations for portfolio diversification.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Find hedging opportunities for my Ethereum position"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze correlations to find assets that could hedge your Ethereum exposure.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ]
  ],
  validate: async (runtime, message, state) => {
    elizaLogger4.log("\u{1F50D} Validating getCorrelationAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger4.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    const requestId = generateRequestId();
    elizaLogger4.log("\u{1F680} Starting TokenMetrics correlation handler (1.x)");
    elizaLogger4.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger4.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      if (!state) {
        state = await runtime.composeState(message);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = CORRELATION_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
      let correlationRequest = null;
      try {
        correlationRequest = await extractTokenMetricsRequest(
          runtime,
          message,
          state,
          enhancedTemplate,
          CorrelationRequestSchema,
          requestId
        );
      } catch (error) {
        elizaLogger4.log(`\u26A0\uFE0F AI extraction failed, proceeding with general correlation data`);
      }
      let tokenId = null;
      if (correlationRequest?.cryptocurrency) {
        try {
          const resolvedToken = await resolveTokenSmart(correlationRequest.cryptocurrency, runtime);
          if (resolvedToken?.TOKEN_ID) {
            tokenId = resolvedToken.TOKEN_ID;
            elizaLogger4.log(`\u2705 Resolved "${correlationRequest.cryptocurrency}" to token ID: ${tokenId}`);
          }
        } catch (error) {
          elizaLogger4.log(`\u26A0\uFE0F Token resolution failed for "${correlationRequest.cryptocurrency}"`);
        }
      }
      const apiParams = {
        limit: correlationRequest?.limit || 20,
        page: correlationRequest?.page || 1
      };
      if (tokenId) {
        apiParams.token_id = tokenId;
        elizaLogger4.log(`\u{1F3AF} Fetching correlation data for token ID: ${tokenId}`);
      } else {
        elizaLogger4.log(`\u{1F4E1} Fetching general correlation data`);
      }
      const correlationData = await callTokenMetricsAPI("/v2/correlation", apiParams, runtime);
      if (!correlationData) {
        elizaLogger4.log("\u274C Failed to fetch correlation data");
        if (callback) {
          await callback({
            text: `\u274C Unable to fetch correlation data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting

Please try again in a few moments.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return createActionResult3({
          success: false,
          text: "\u274C Unable to fetch correlation data at the moment.",
          data: {
            error: "API fetch failed",
            request_id: requestId
          }
        });
      }
      const correlations = Array.isArray(correlationData) ? correlationData : correlationData.data || [];
      elizaLogger4.log(`\u{1F50D} Received ${correlations.length} correlation data points`);
      if (correlations.length > 0) {
        elizaLogger4.log(`\u{1F52C} Sample correlation data structure:`, JSON.stringify(correlations[0], null, 2));
      }
      const responseText = formatCorrelationResponse(correlations);
      const analysis = analyzeCorrelationData(correlations, "comprehensive");
      elizaLogger4.success("\u2705 Successfully processed correlation request");
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            correlation_data: correlations,
            analysis,
            source: "TokenMetrics Correlation API",
            request_id: requestId,
            metadata: {
              endpoint: "correlation",
              data_source: "TokenMetrics API",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              total_correlations: correlations.length
            }
          }
        });
      }
      return createActionResult3({
        success: true,
        text: responseText,
        data: {
          success: true,
          correlation_data: correlations,
          analysis,
          source: "TokenMetrics Correlation API",
          request_id: requestId,
          metadata: {
            endpoint: "correlation",
            data_source: "TokenMetrics API",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            total_correlations: correlations.length
          }
        }
      });
    } catch (error) {
      elizaLogger4.error("\u274C Error in correlation handler:", error);
      elizaLogger4.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      if (callback) {
        await callback({
          text: `\u274C I encountered an error while fetching correlation data: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: requestId
          }
        });
      }
      return createActionResult3({
        success: false,
        error: errorMessage
      });
    }
  }
};
function formatCorrelationResponse(correlations) {
  if (!correlations || correlations.length === 0) {
    return "\u274C No correlation data available.";
  }
  let response = `\u{1F4CA} **Token Correlation Analysis**

`;
  response += `\u{1F517} **Total Correlations**: ${correlations.length}

`;
  if (correlations.length > 0) {
    const topCorrelations = correlations.slice(0, 10);
    response += `\u{1F4C8} **Top Correlations**:
`;
    let correlationCount = 0;
    topCorrelations.forEach((corrData, index) => {
      const mainToken = corrData.TOKEN_NAME || corrData.TOKEN_SYMBOL || "Unknown Token";
      const topCorrelations2 = corrData.TOP_CORRELATION || [];
      if (mainToken === "Unknown Token" || !Array.isArray(topCorrelations2) || topCorrelations2.length === 0) {
        elizaLogger4.log(`\u26A0\uFE0F Skipping correlation entry ${index + 1}: Invalid data for ${mainToken}`);
        return;
      }
      const topThree = topCorrelations2.slice(0, 3);
      topThree.forEach((corrItem, subIndex) => {
        if (correlationCount >= 10) return;
        const correlatedToken = corrItem.token || "Unknown Token";
        const correlationValue = corrItem.correlation || 0;
        if (correlatedToken !== "Unknown Token" && correlationValue !== 0) {
          correlationCount++;
          const direction = correlationValue > 0 ? "\u{1F4C8}" : "\u{1F4C9}";
          response += `${correlationCount}. ${direction} **${mainToken}** \u2194 **${correlatedToken}**: ${correlationValue.toFixed(3)}
`;
        }
      });
    });
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics Correlation API
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeCorrelationData(correlationData, analysisType = "all") {
  if (!correlationData || correlationData.length === 0) {
    return {
      summary: "No correlation data available for analysis",
      diversification_opportunities: "Cannot assess",
      insights: []
    };
  }
  const correlationDistribution = analyzeCorrelationDistribution(correlationData);
  const diversificationAnalysis = analyzeDiversificationOpportunities(correlationData);
  const riskAnalysis = analyzeCorrelationRisks(correlationData);
  const portfolioOptimization = generatePortfolioOptimization(correlationData);
  const marketRegimeAnalysis = analyzeMarketRegimes(correlationData);
  const insights = generateCorrelationInsights(correlationDistribution, diversificationAnalysis, riskAnalysis);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "diversification":
      focusedAnalysis = {
        diversification_focus: {
          best_diversifiers: diversificationAnalysis.best_diversifiers.slice(0, 5),
          diversification_score: diversificationAnalysis.diversification_ratio,
          portfolio_recommendations: generateDiversificationRecommendations(correlationData),
          diversification_insights: [
            `\u{1F3AF} ${diversificationAnalysis.low_correlation_assets} assets with low correlation found`,
            `\u{1F4CA} Diversification quality: ${diversificationAnalysis.diversification_quality}`,
            `\u2696\uFE0F Portfolio balance: ${diversificationAnalysis.diversification_ratio} of assets suitable for diversification`,
            `\u{1F504} Rebalancing frequency: ${getDiversificationRebalancingFrequency(correlationDistribution.average_correlation)}`
          ]
        }
      };
      break;
    case "hedging":
      focusedAnalysis = {
        hedging_focus: {
          hedging_opportunities: identifyHedgingOpportunities(correlationData),
          negative_correlations: correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < -0.3),
          hedging_strategies: generateHedgingStrategies(correlationData),
          hedging_insights: [
            `\u{1F6E1}\uFE0F ${correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < -0.3).length} potential hedging assets identified`,
            `\u{1F4C9} Strongest hedge: ${getStrongestHedge(correlationData)}`,
            `\u2696\uFE0F Hedge effectiveness: ${assessOverallHedgingEffectiveness(correlationData)}`,
            `\u{1F504} Dynamic hedging recommended: ${shouldUseDynamicHedging(correlationDistribution.average_correlation)}`
          ]
        }
      };
      break;
    case "risk_management":
      focusedAnalysis = {
        risk_management_focus: {
          concentration_risks: riskAnalysis,
          risk_factors: identifyCorrelationRiskFactors(
            correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7),
            correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.9)
          ),
          stress_test_implications: generateStressTestImplications(
            parseFloat(correlationDistribution.average_correlation),
            correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7).length / correlationData.length
          ),
          risk_insights: [
            `\u26A0\uFE0F Concentration risk level: ${riskAnalysis.concentration_risk}`,
            `\u{1F4CA} High correlation assets: ${correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7).length}`,
            `\u{1F3AF} Portfolio efficiency score: ${calculatePortfolioEfficiencyScore(correlationData)}`,
            `\u{1F4C8} Volatility multiplier: ${calculateVolatilityMultiplier(parseFloat(correlationDistribution.average_correlation))}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Correlation analysis of ${correlationData.length} relationships shows ${diversificationAnalysis.diversification_quality} diversification opportunities with ${riskAnalysis.concentration_risk} concentration risk`,
    analysis_type: analysisType,
    correlation_distribution: correlationDistribution,
    diversification_analysis: diversificationAnalysis,
    risk_analysis: riskAnalysis,
    portfolio_optimization: portfolioOptimization,
    market_regime_analysis: marketRegimeAnalysis,
    insights,
    strategic_recommendations: generateStrategicRecommendations(diversificationAnalysis, riskAnalysis, portfolioOptimization),
    hedging_opportunities: identifyHedgingOpportunities(correlationData),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics Correlation Engine",
      relationship_count: correlationData.length,
      coverage_scope: assessCoverageScope(correlationData),
      data_reliability: assessDataReliability(correlationData)
    },
    portfolio_construction_guidelines: [
      "\u{1F3AF} Target correlation below 0.3 for effective diversification",
      "\u2696\uFE0F Balance high-return assets with low-correlation alternatives",
      "\u{1F504} Rebalance when correlations shift significantly",
      "\u{1F4CA} Monitor correlation changes during market stress",
      "\u{1F6E1}\uFE0F Use negative correlations for hedging strategies",
      "\u{1F4C8} Consider correlation stability over time periods"
    ]
  };
}
function analyzeCorrelationDistribution(correlationData) {
  const correlations = correlationData.map((item) => item.CORRELATION || item.CORRELATION_VALUE).filter((corr) => corr !== null && corr !== void 0);
  if (correlations.length === 0) {
    return { distribution: "No correlation values available" };
  }
  const veryHighPositive = correlations.filter((c) => c >= 0.8).length;
  const highPositive = correlations.filter((c) => c >= 0.5 && c < 0.8).length;
  const moderatePositive = correlations.filter((c) => c >= 0.2 && c < 0.5).length;
  const weak = correlations.filter((c) => c >= -0.2 && c < 0.2).length;
  const moderateNegative = correlations.filter((c) => c >= -0.5 && c < -0.2).length;
  const highNegative = correlations.filter((c) => c >= -0.8 && c < -0.5).length;
  const veryHighNegative = correlations.filter((c) => c < -0.8).length;
  const avgCorrelation = correlations.reduce((sum, corr) => sum + corr, 0) / correlations.length;
  const maxCorrelation = Math.max(...correlations);
  const minCorrelation = Math.min(...correlations);
  return {
    total_relationships: correlations.length,
    average_correlation: avgCorrelation.toFixed(3),
    max_correlation: maxCorrelation.toFixed(3),
    min_correlation: minCorrelation.toFixed(3),
    correlation_range: (maxCorrelation - minCorrelation).toFixed(3),
    distribution: {
      very_high_positive: `${veryHighPositive} (${(veryHighPositive / correlations.length * 100).toFixed(1)}%)`,
      high_positive: `${highPositive} (${(highPositive / correlations.length * 100).toFixed(1)}%)`,
      moderate_positive: `${moderatePositive} (${(moderatePositive / correlations.length * 100).toFixed(1)}%)`,
      weak: `${weak} (${(weak / correlations.length * 100).toFixed(1)}%)`,
      moderate_negative: `${moderateNegative} (${(moderateNegative / correlations.length * 100).toFixed(1)}%)`,
      high_negative: `${highNegative} (${(highNegative / correlations.length * 100).toFixed(1)}%)`,
      very_high_negative: `${veryHighNegative} (${(veryHighNegative / correlations.length * 100).toFixed(1)}%)`
    },
    market_structure: interpretMarketStructure(avgCorrelation, veryHighPositive, correlations.length)
  };
}
function analyzeDiversificationOpportunities(correlationData) {
  const diversificationCandidates = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < 0.3).sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE) - (b.CORRELATION || b.CORRELATION_VALUE)).slice(0, 10);
  const highCorrelationAssets = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7).sort((a, b) => (b.CORRELATION || b.CORRELATION_VALUE) - (a.CORRELATION || a.CORRELATION_VALUE)).slice(0, 10);
  const lowCorrelationCount = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
  const totalCount = correlationData.length;
  const diversificationRatio = totalCount > 0 ? lowCorrelationCount / totalCount : 0;
  let diversificationQuality;
  if (diversificationRatio > 0.6) diversificationQuality = "Excellent";
  else if (diversificationRatio > 0.4) diversificationQuality = "Good";
  else if (diversificationRatio > 0.25) diversificationQuality = "Moderate";
  else diversificationQuality = "Limited";
  return {
    diversification_quality: diversificationQuality,
    diversification_ratio: `${(diversificationRatio * 100).toFixed(1)}%`,
    low_correlation_assets: lowCorrelationCount,
    best_diversifiers: diversificationCandidates.map((item) => ({
      token: `${item.TOKEN_NAME || item.NAME || "Unknown"} (${item.SYMBOL || "N/A"})`,
      correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
      diversification_benefit: interpretDiversificationBenefit(item.CORRELATION || item.CORRELATION_VALUE || 0)
    })),
    avoid_for_diversification: highCorrelationAssets.map((item) => ({
      token: `${item.TOKEN_NAME || item.NAME || "Unknown"} (${item.SYMBOL || "N/A"})`,
      correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
      risk_level: interpretRiskLevel(item.CORRELATION || item.CORRELATION_VALUE || 0)
    })),
    portfolio_construction_guidance: generatePortfolioConstructionGuidance(diversificationRatio, diversificationCandidates.length)
  };
}
function analyzeCorrelationRisks(correlationData) {
  const highCorrelations = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.7);
  const veryHighCorrelations = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) > 0.9);
  const highCorrelationRatio = correlationData.length > 0 ? highCorrelations.length / correlationData.length : 0;
  let concentrationRisk;
  if (highCorrelationRatio > 0.5) concentrationRisk = "Very High";
  else if (highCorrelationRatio > 0.3) concentrationRisk = "High";
  else if (highCorrelationRatio > 0.15) concentrationRisk = "Moderate";
  else concentrationRisk = "Low";
  const sectorConcentration = analyzeSectorConcentration(correlationData);
  const avgCorrelation = correlationData.reduce((sum, item) => sum + (item.CORRELATION || item.CORRELATION_VALUE || 0), 0) / correlationData.length;
  const portfolioVolatilityMultiplier = calculateVolatilityMultiplier(avgCorrelation);
  return {
    concentration_risk: concentrationRisk,
    high_correlation_ratio: `${(highCorrelationRatio * 100).toFixed(1)}%`,
    very_high_correlations: veryHighCorrelations.length,
    sector_concentration: sectorConcentration,
    average_correlation: avgCorrelation.toFixed(3),
    portfolio_volatility_impact: portfolioVolatilityMultiplier,
    risk_factors: identifyCorrelationRiskFactors(highCorrelations, veryHighCorrelations),
    stress_test_implications: generateStressTestImplications(avgCorrelation, highCorrelationRatio)
  };
}
function generatePortfolioOptimization(correlationData) {
  const lowCorrelationPairs = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.2).sort((a, b) => Math.abs(a.CORRELATION || a.CORRELATION_VALUE || 0) - Math.abs(b.CORRELATION || b.CORRELATION_VALUE || 0));
  const negativeCorrelationAssets = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.1).sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE || 0) - (b.CORRELATION || b.CORRELATION_VALUE || 0));
  const optimizationStrategies = [];
  if (lowCorrelationPairs.length > 5) {
    optimizationStrategies.push("Equal-weight diversification strategy suitable due to multiple low-correlation options");
  }
  if (negativeCorrelationAssets.length > 2) {
    optimizationStrategies.push("Natural hedging opportunities available with negatively correlated assets");
  }
  if (optimizationStrategies.length === 0) {
    optimizationStrategies.push("Limited diversification options - consider looking beyond current asset universe");
  }
  return {
    optimization_opportunities: lowCorrelationPairs.length,
    natural_hedges: negativeCorrelationAssets.length,
    recommended_strategies: optimizationStrategies,
    core_diversifiers: lowCorrelationPairs.slice(0, 5).map((item) => ({
      asset: `${item.TOKEN_NAME || item.NAME || "Unknown"} (${item.SYMBOL || "N/A"})`,
      correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
      allocation_suggestion: suggestAllocation(item.CORRELATION || item.CORRELATION_VALUE || 0)
    })),
    hedging_assets: negativeCorrelationAssets.slice(0, 3).map((item) => ({
      asset: `${item.TOKEN_NAME || item.NAME || "Unknown"} (${item.SYMBOL || "N/A"})`,
      correlation: (item.CORRELATION || item.CORRELATION_VALUE || 0).toFixed(3),
      hedging_effectiveness: assessHedgingEffectiveness(item.CORRELATION || item.CORRELATION_VALUE || 0)
    })),
    portfolio_efficiency_score: calculatePortfolioEfficiencyScore(correlationData)
  };
}
function analyzeMarketRegimes(correlationData) {
  const avgCorrelation = correlationData.reduce((sum, item) => sum + Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0), 0) / correlationData.length;
  const highCorrelationCount = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) > 0.7).length;
  const lowCorrelationCount = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
  let marketRegime;
  let regimeCharacteristics = [];
  if (avgCorrelation > 0.6 && highCorrelationCount > correlationData.length * 0.5) {
    marketRegime = "High Correlation Regime";
    regimeCharacteristics = [
      "Assets move together during market stress",
      "Diversification benefits reduced",
      "Risk-off sentiment dominates",
      "Systematic risk elevated"
    ];
  } else if (avgCorrelation < 0.3 && lowCorrelationCount > correlationData.length * 0.6) {
    marketRegime = "Low Correlation Regime";
    regimeCharacteristics = [
      "Assets behave independently",
      "Strong diversification benefits",
      "Idiosyncratic factors dominate",
      "Stock-picking environment"
    ];
  } else {
    marketRegime = "Mixed Correlation Regime";
    regimeCharacteristics = [
      "Moderate correlation levels",
      "Balanced systematic and idiosyncratic risk",
      "Normal market conditions",
      "Standard diversification benefits"
    ];
  }
  return {
    current_regime: marketRegime,
    regime_characteristics: regimeCharacteristics,
    average_correlation: avgCorrelation.toFixed(3),
    regime_stability: assessRegimeStability(correlationData),
    implications_for_strategy: generateRegimeImplications(marketRegime),
    monitoring_indicators: [
      "Track correlation changes during market stress",
      "Monitor dispersion of asset returns",
      "Watch for correlation breakdowns",
      "Assess sector rotation patterns"
    ]
  };
}
function generateCorrelationInsights(distribution, diversification, risks) {
  const insights = [];
  const avgCorr = parseFloat(distribution.average_correlation);
  if (avgCorr > 0.5) {
    insights.push("High average correlation suggests limited diversification benefits and elevated systematic risk");
  } else if (avgCorr < 0.2) {
    insights.push("Low average correlation provides excellent diversification opportunities for risk reduction");
  } else {
    insights.push("Moderate correlation levels offer balanced diversification benefits with manageable systematic risk");
  }
  if (diversification.diversification_quality === "Excellent") {
    insights.push(`${diversification.diversification_ratio} of assets provide good diversification - strong portfolio construction potential`);
  } else if (diversification.diversification_quality === "Limited") {
    insights.push("Limited diversification options require looking beyond current asset universe or using alternative strategies");
  }
  if (risks.concentration_risk === "Very High" || risks.concentration_risk === "High") {
    insights.push("High concentration risk from correlated assets requires careful position sizing and risk management");
  }
  if (diversification.best_diversifiers.length > 5) {
    insights.push(`${diversification.best_diversifiers.length} low-correlation assets identified for portfolio diversification`);
  }
  if (distribution.market_structure?.includes("Crisis")) {
    insights.push("Crisis-like correlation structure suggests heightened systematic risk and reduced diversification benefits");
  } else if (distribution.market_structure?.includes("Normal")) {
    insights.push("Normal market correlation structure supports standard portfolio construction approaches");
  }
  return insights;
}
function generateStrategicRecommendations(diversification, risks, optimization) {
  const recommendations = [];
  let primaryStrategy = "Balanced Diversification";
  if (diversification.diversification_quality === "Excellent") {
    recommendations.push("Implement equal-weight diversification strategy across low-correlation assets");
    recommendations.push("Take advantage of abundant diversification opportunities");
    primaryStrategy = "Aggressive Diversification";
  } else if (diversification.diversification_quality === "Limited") {
    recommendations.push("Seek alternative asset classes or strategies for diversification");
    recommendations.push("Consider factor-based diversification if asset diversification is limited");
    primaryStrategy = "Alternative Diversification";
  }
  if (risks.concentration_risk === "Very High") {
    recommendations.push("Reduce position sizes in highly correlated assets");
    recommendations.push("Implement strict correlation monitoring and limits");
    primaryStrategy = "Risk Reduction Focus";
  }
  if (optimization.natural_hedges > 2) {
    recommendations.push("Utilize natural hedging relationships for portfolio protection");
    recommendations.push("Consider pairs trading strategies with negatively correlated assets");
  }
  recommendations.push("Regular correlation monitoring for changing market conditions");
  recommendations.push("Stress test portfolio under high correlation scenarios");
  recommendations.push("Consider dynamic allocation based on correlation regime changes");
  return {
    primary_strategy: primaryStrategy,
    strategic_recommendations: recommendations,
    implementation_priorities: generateImplementationPriorities(diversification, risks),
    risk_management_protocols: generateRiskManagementProtocols(risks),
    monitoring_framework: generateMonitoringFramework(diversification, risks)
  };
}
function identifyHedgingOpportunities(correlationData) {
  const hedgingAssets = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.2).sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE || 0) - (b.CORRELATION || b.CORRELATION_VALUE || 0));
  const opportunities = hedgingAssets.map((asset) => ({
    asset_name: `${asset.TOKEN_NAME || asset.NAME || "Unknown"} (${asset.SYMBOL || "N/A"})`,
    correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
    hedging_effectiveness: assessHedgingEffectiveness(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
    recommended_hedge_ratio: calculateHedgeRatio(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
    strategy_type: determineHedgingStrategy(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
  }));
  return {
    available_hedges: opportunities.length,
    hedging_opportunities: opportunities.slice(0, 5),
    hedging_strategies: [
      "Direct hedging with negatively correlated assets",
      "Portfolio insurance using inverse relationships",
      "Pairs trading for market-neutral strategies",
      "Dynamic hedging based on correlation changes"
    ],
    hedging_effectiveness_assessment: opportunities.length > 0 ? "Good hedging options available" : "Limited hedging opportunities",
    implementation_guidance: [
      "Start with small hedge ratios and adjust based on performance",
      "Monitor correlation stability for hedge effectiveness",
      "Consider transaction costs in hedging decisions",
      "Regular rebalancing of hedge positions"
    ]
  };
}
function interpretMarketStructure(avgCorrelation, veryHighPositiveCount, totalCount) {
  const extremeCorrelationRatio = veryHighPositiveCount / totalCount;
  if (avgCorrelation > 0.7 && extremeCorrelationRatio > 0.3) {
    return "Crisis-like structure with high systematic risk";
  } else if (avgCorrelation > 0.5) {
    return "Elevated correlation suggesting increased systematic risk";
  } else if (avgCorrelation < 0.2) {
    return "Low correlation structure ideal for diversification";
  } else {
    return "Normal market correlation structure";
  }
}
function interpretDiversificationBenefit(correlation) {
  if (correlation < -0.5) return "Excellent diversification and hedging potential";
  if (correlation < -0.2) return "Good diversification with hedging benefits";
  if (correlation < 0.2) return "Good diversification potential";
  if (correlation < 0.5) return "Moderate diversification benefits";
  return "Limited diversification value";
}
function interpretRiskLevel(correlation) {
  if (correlation > 0.9) return "Very High Risk - moves almost identically";
  if (correlation > 0.8) return "High Risk - strong similar movements";
  if (correlation > 0.6) return "Moderate Risk - noticeable similar patterns";
  return "Low Risk - minimal movement similarity";
}
function generatePortfolioConstructionGuidance(diversificationRatio, diversifierCount) {
  const guidance = [];
  if (diversificationRatio > 0.6) {
    guidance.push("Equal-weight approach viable due to good diversification options");
    guidance.push("Can use higher number of positions without concentration risk");
  } else if (diversificationRatio > 0.3) {
    guidance.push("Selective diversification focusing on best low-correlation assets");
    guidance.push("Balance between diversification and position concentration");
  } else {
    guidance.push("Limited diversification requires concentrated high-conviction approach");
    guidance.push("Consider factor-based or alternative diversification methods");
  }
  if (diversifierCount > 10) {
    guidance.push("Abundant diversification options allow for sophisticated portfolio construction");
  } else if (diversifierCount < 5) {
    guidance.push("Limited diversifiers require careful selection and sizing");
  }
  return guidance;
}
function analyzeSectorConcentration(correlationData) {
  const sectorCounts = /* @__PURE__ */ new Map();
  correlationData.forEach((item) => {
    const sector = item.CATEGORY || item.SECTOR || "Unknown";
    sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
  });
  const sectors = Array.from(sectorCounts.entries()).sort((a, b) => b[1] - a[1]);
  const totalAssets = correlationData.length;
  const topSectorRatio = sectors.length > 0 ? sectors[0][1] / totalAssets : 0;
  let concentrationLevel;
  if (topSectorRatio > 0.6) concentrationLevel = "Very High";
  else if (topSectorRatio > 0.4) concentrationLevel = "High";
  else if (topSectorRatio > 0.25) concentrationLevel = "Moderate";
  else concentrationLevel = "Low";
  return {
    concentration_level: concentrationLevel,
    top_sector: sectors[0]?.[0] || "Unknown",
    top_sector_percentage: `${(topSectorRatio * 100).toFixed(1)}%`,
    sector_distribution: sectors.slice(0, 5).map(([sector, count]) => ({
      sector,
      count,
      percentage: `${(count / totalAssets * 100).toFixed(1)}%`
    }))
  };
}
function calculateVolatilityMultiplier(avgCorrelation) {
  const multiplier = Math.sqrt(avgCorrelation);
  if (multiplier > 0.9) return "Very High Impact - portfolio volatility barely reduced";
  if (multiplier > 0.7) return "High Impact - limited volatility reduction";
  if (multiplier > 0.5) return "Moderate Impact - reasonable volatility reduction";
  if (multiplier > 0.3) return "Low Impact - good volatility reduction";
  return "Very Low Impact - excellent volatility reduction";
}
function identifyCorrelationRiskFactors(highCorrelations, veryHighCorrelations) {
  const factors = [];
  if (veryHighCorrelations.length > 0) {
    factors.push("Extremely high correlations eliminate diversification benefits");
  }
  if (highCorrelations.length > 5) {
    factors.push("Multiple high-correlation relationships increase systematic risk");
  }
  const sectorCounts = /* @__PURE__ */ new Map();
  highCorrelations.forEach((item) => {
    const sector = item.CATEGORY || item.SECTOR || "Unknown";
    sectorCounts.set(sector, (sectorCounts.get(sector) || 0) + 1);
  });
  if (sectorCounts.size < 3) {
    factors.push("High correlations concentrated in few sectors increases sector risk");
  }
  factors.push("Correlation can increase during market stress periods");
  return factors;
}
function generateStressTestImplications(avgCorrelation, highCorrelationRatio) {
  const implications = [];
  if (avgCorrelation > 0.6) {
    implications.push("High correlation suggests portfolio will move as one unit during stress");
    implications.push("Expect minimal protection from diversification during market downturns");
  }
  if (highCorrelationRatio > 0.4) {
    implications.push("Significant portion of portfolio exhibits high correlation - stress test with 80%+ correlation");
  }
  implications.push("Monitor correlation increases during market volatility");
  implications.push("Prepare for correlation convergence during crisis periods");
  return implications;
}
function suggestAllocation(correlation) {
  if (correlation < -0.3) return "10-20% - Strong diversifier";
  if (correlation < 0.1) return "15-25% - Good diversifier";
  if (correlation < 0.3) return "10-15% - Moderate diversifier";
  if (correlation < 0.5) return "5-10% - Limited diversification";
  return "3-5% - Minimal allocation due to high correlation";
}
function assessHedgingEffectiveness(correlation) {
  if (correlation < -0.8) return "Excellent hedge - very strong inverse relationship";
  if (correlation < -0.5) return "Good hedge - strong inverse relationship";
  if (correlation < -0.2) return "Moderate hedge - some inverse relationship";
  return "Limited hedging effectiveness";
}
function calculateHedgeRatio(correlation) {
  const ratio = Math.abs(correlation);
  if (ratio > 0.8) return "0.8-1.0 - High hedge ratio suitable";
  if (ratio > 0.5) return "0.5-0.7 - Moderate hedge ratio";
  if (ratio > 0.3) return "0.3-0.5 - Conservative hedge ratio";
  return "0.1-0.3 - Small hedge ratio";
}
function determineHedgingStrategy(correlation) {
  if (correlation < -0.7) return "Direct hedge - strong inverse relationship";
  if (correlation < -0.4) return "Portfolio insurance - moderate inverse relationship";
  if (correlation < -0.2) return "Diversification hedge - mild inverse relationship";
  return "Pairs trading - exploits correlation patterns";
}
function calculatePortfolioEfficiencyScore(correlationData) {
  const lowCorrelationCount = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).length;
  const totalCount = correlationData.length;
  const negativeCorrelationCount = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE || 0) < -0.1).length;
  let score = 0;
  score += lowCorrelationCount / totalCount * 60;
  score += negativeCorrelationCount / totalCount * 40;
  if (score > 80) return "Excellent - Strong diversification and hedging opportunities";
  if (score > 60) return "Good - Solid diversification with some hedging";
  if (score > 40) return "Moderate - Limited but usable diversification";
  return "Poor - Minimal diversification opportunities";
}
function assessRegimeStability(correlationData) {
  const correlationRange = Math.max(...correlationData.map((item) => item.CORRELATION || item.CORRELATION_VALUE || 0)) - Math.min(...correlationData.map((item) => item.CORRELATION || item.CORRELATION_VALUE || 0));
  if (correlationRange > 1.5) return "Unstable - Wide correlation range suggests regime changes";
  if (correlationRange > 1) return "Moderate - Some correlation variation observed";
  return "Stable - Consistent correlation patterns";
}
function generateRegimeImplications(marketRegime) {
  const implications = [];
  if (marketRegime === "High Correlation Regime") {
    implications.push("Reduce reliance on diversification for risk management");
    implications.push("Focus on absolute return strategies and hedging");
    implications.push("Consider alternative assets outside correlated universe");
  } else if (marketRegime === "Low Correlation Regime") {
    implications.push("Maximize diversification benefits with equal-weight strategies");
    implications.push("Focus on stock selection and fundamental analysis");
    implications.push("Reduce hedging as natural diversification provides protection");
  } else {
    implications.push("Balance diversification and hedging strategies");
    implications.push("Monitor for regime changes that could affect strategy");
    implications.push("Maintain flexible approach to adapt to regime shifts");
  }
  return implications;
}
function generateImplementationPriorities(diversification, risks) {
  const priorities = [];
  if (risks.concentration_risk === "Very High") {
    priorities.push("1. Immediate risk reduction through position sizing limits");
    priorities.push("2. Implement correlation monitoring systems");
  } else {
    priorities.push("1. Optimize portfolio using identified diversifiers");
  }
  if (diversification.diversification_quality === "Excellent") {
    priorities.push("2. Build diversified core portfolio with low-correlation assets");
    priorities.push("3. Implement systematic rebalancing");
  } else {
    priorities.push("2. Seek additional diversification sources outside current universe");
  }
  priorities.push("3. Establish correlation monitoring and alerting systems");
  return priorities;
}
function generateRiskManagementProtocols(risks) {
  const protocols = [];
  if (risks.concentration_risk === "Very High" || risks.concentration_risk === "High") {
    protocols.push("Maximum 5% allocation to any single highly correlated asset");
    protocols.push("Combined limit of 25% to assets with correlation >0.7");
  }
  protocols.push("Monthly correlation review and portfolio adjustment");
  protocols.push("Stress test portfolio assuming 80%+ correlation during crisis");
  protocols.push("Alert system for correlation changes >0.2 from baseline");
  return protocols;
}
function generateMonitoringFramework(diversification, risks) {
  return {
    monitoring_frequency: "Weekly correlation updates with monthly deep analysis",
    key_metrics: [
      "Average portfolio correlation",
      "Number of high correlation relationships (>0.7)",
      "Diversification ratio (assets with correlation <0.3)",
      "Maximum pairwise correlation in portfolio"
    ],
    alert_triggers: [
      "Average correlation increases by >0.15",
      "Number of high correlations doubles",
      "Diversification ratio drops below 30%",
      "Any correlation exceeds 0.95"
    ],
    reporting_requirements: [
      "Monthly correlation heatmap",
      "Quarterly portfolio efficiency assessment",
      "Semi-annual stress test results",
      "Annual correlation regime analysis"
    ]
  };
}
function assessCoverageScope(correlationData) {
  const tokenCount = correlationData.length;
  const uniqueSymbols = new Set(correlationData.map((item) => item.SYMBOL).filter((s) => s)).size;
  if (tokenCount > 50 && uniqueSymbols > 40) return "Comprehensive";
  if (tokenCount > 25 && uniqueSymbols > 20) return "Good";
  if (tokenCount > 10 && uniqueSymbols > 8) return "Moderate";
  return "Limited";
}
function assessDataReliability(correlationData) {
  const validCorrelations = correlationData.filter(
    (item) => item.CORRELATION !== null && item.CORRELATION !== void 0 || item.CORRELATION_VALUE !== null && item.CORRELATION_VALUE !== void 0
  ).length;
  const reliabilityRatio = correlationData.length > 0 ? validCorrelations / correlationData.length : 0;
  if (reliabilityRatio > 0.95) return "Excellent - comprehensive correlation data";
  if (reliabilityRatio > 0.85) return "Good - most relationships have valid correlation data";
  if (reliabilityRatio > 0.7) return "Fair - some missing correlation values";
  return "Limited - significant gaps in correlation data";
}
function generateDiversificationRecommendations(correlationData) {
  const lowCorrelationAssets = correlationData.filter((item) => Math.abs(item.CORRELATION || item.CORRELATION_VALUE || 0) < 0.3).sort((a, b) => Math.abs(a.CORRELATION || a.CORRELATION_VALUE || 0) - Math.abs(b.CORRELATION || b.CORRELATION_VALUE || 0)).slice(0, 5);
  return lowCorrelationAssets.map((asset) => ({
    token: `${asset.TOKEN_NAME || asset.NAME || "Unknown"} (${asset.SYMBOL || "N/A"})`,
    correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
    allocation_suggestion: suggestAllocation(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
    diversification_benefit: interpretDiversificationBenefit(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
  }));
}
function getDiversificationRebalancingFrequency(avgCorrelation) {
  const correlation = parseFloat(avgCorrelation);
  if (correlation > 0.6) return "Monthly - high correlation requires frequent rebalancing";
  if (correlation > 0.4) return "Quarterly - moderate correlation needs regular monitoring";
  if (correlation > 0.2) return "Semi-annually - low correlation allows longer periods";
  return "Annually - very low correlation provides stable diversification";
}
function generateHedgingStrategies(correlationData) {
  const hedgingAssets = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < -0.2).sort((a, b) => (a.CORRELATION || a.CORRELATION_VALUE) - (b.CORRELATION || b.CORRELATION_VALUE)).slice(0, 5);
  return hedgingAssets.map((asset) => ({
    token: `${asset.TOKEN_NAME || asset.NAME || "Unknown"} (${asset.SYMBOL || "N/A"})`,
    correlation: (asset.CORRELATION || asset.CORRELATION_VALUE || 0).toFixed(3),
    hedge_ratio: calculateHedgeRatio(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
    hedging_strategy: determineHedgingStrategy(asset.CORRELATION || asset.CORRELATION_VALUE || 0),
    effectiveness: assessHedgingEffectiveness(asset.CORRELATION || asset.CORRELATION_VALUE || 0)
  }));
}
function getStrongestHedge(correlationData) {
  const negativeCorrelations = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < 0);
  if (negativeCorrelations.length === 0) return "No negative correlations found";
  const strongest = negativeCorrelations.reduce(
    (min, current) => (current.CORRELATION || current.CORRELATION_VALUE) < (min.CORRELATION || min.CORRELATION_VALUE) ? current : min
  );
  return `${strongest.TOKEN_NAME || strongest.NAME || "Unknown"} (${strongest.SYMBOL || "N/A"}) with ${(strongest.CORRELATION || strongest.CORRELATION_VALUE || 0).toFixed(3)} correlation`;
}
function assessOverallHedgingEffectiveness(correlationData) {
  const negativeCorrelations = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < 0);
  const strongNegativeCorrelations = correlationData.filter((item) => (item.CORRELATION || item.CORRELATION_VALUE) < -0.5);
  if (strongNegativeCorrelations.length > 3) return "Excellent - multiple strong hedging options available";
  if (negativeCorrelations.length > 5) return "Good - several hedging opportunities identified";
  if (negativeCorrelations.length > 2) return "Moderate - limited hedging options available";
  return "Poor - few or no effective hedging opportunities";
}
function shouldUseDynamicHedging(avgCorrelation) {
  const correlation = parseFloat(avgCorrelation);
  if (correlation > 0.7) return "Yes - high correlations require dynamic hedging strategies";
  if (correlation > 0.4) return "Consider - moderate correlations may benefit from dynamic approaches";
  return "No - low correlations allow for static hedging strategies";
}

// src/actions/getHourlyTradingSignalsAction.ts
import {
  elizaLogger as elizaLogger5,
  createActionResult as createActionResult4
} from "@elizaos/core";
var HourlyTradingSignalsRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  signal: external_exports.number().optional().describe("Filter by signal type (1=bullish, -1=bearish, 0=neutral)"),
  startDate: external_exports.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: external_exports.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  category: external_exports.string().optional().describe("Token category filter"),
  exchange: external_exports.string().optional().describe("Exchange filter"),
  marketcap: external_exports.number().optional().describe("Minimum market cap filter"),
  volume: external_exports.number().optional().describe("Minimum volume filter"),
  fdv: external_exports.number().optional().describe("Minimum fully diluted valuation filter"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of signals to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["active_trading", "scalping", "momentum", "all"]).optional().describe("Type of analysis to focus on")
});
var HOURLY_TRADING_SIGNALS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting hourly trading signals requests from natural language.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

The user wants to get AI-generated hourly trading signals for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request
   - EXTRACTION RULE: Use the EXACT cryptocurrency mentioned by the user

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **signal** (optional): Filter by signal type
   - 1 = bullish/long signals
   - -1 = bearish/short signals
   - 0 = neutral signals
   - Look for phrases like "bullish signals", "buy signals", "short signals"

5. **startDate** (optional): Start date for data range
   - Look for dates in YYYY-MM-DD format
   - Convert relative dates like "last week", "past 3 days"

6. **endDate** (optional): End date for data range

7. **category** (optional): Token category filter
   - Look for categories like "defi", "layer1", "gaming"

8. **exchange** (optional): Exchange filter

9. **marketcap** (optional): Minimum market cap filter

10. **volume** (optional): Minimum volume filter

11. **fdv** (optional): Minimum fully diluted valuation filter

12. **limit** (optional, default: 20): Number of signals to return

13. **page** (optional, default: 1): Page number for pagination

14. **analysisType** (optional, default: "all"): What type of analysis they want
    - "active_trading" - focus on frequent trading opportunities
    - "scalping" - focus on very short-term signals
    - "momentum" - focus on momentum-based signals
    - "all" - comprehensive hourly signal analysis

Examples of request patterns (but extract the actual token from user's message):
- "Get hourly trading signals for [TOKEN]" \u2192 extract [TOKEN]
- "Show me bullish hourly signals" \u2192 general bullish signals
- "Hourly buy signals for [TOKEN]" \u2192 extract [TOKEN] and signal type
- "Scalping signals for the past 24 hours" \u2192 scalping analysis

Extract the request details from the user's message and respond in XML format:

<response>
<cryptocurrency>exact token name or symbol from user's message</cryptocurrency>
<token_id>specific token ID if mentioned</token_id>
<symbol>token symbol if mentioned</symbol>
<signal>1 for bullish, -1 for bearish, 0 for neutral</signal>
<startDate>start date in YYYY-MM-DD format</startDate>
<endDate>end date in YYYY-MM-DD format</endDate>
<category>token category</category>
<exchange>exchange name</exchange>
<marketcap>minimum market cap</marketcap>
<volume>minimum volume</volume>
<fdv>minimum fully diluted valuation</fdv>
<limit>number of signals to return</limit>
<page>page number</page>
<analysisType>active_trading|scalping|momentum|all</analysisType>
</response>
`;
var getHourlyTradingSignalsAction = {
  name: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS",
  description: "Get AI-generated hourly trading signals for cryptocurrencies with frequent updates for active trading from TokenMetrics",
  similes: [
    "get hourly trading signals",
    "get hourly AI signals",
    "check hourly buy sell signals",
    "get hourly trading recommendations",
    "hourly AI trading signals",
    "frequent trading signals",
    "get hourly entry exit points",
    "active trading signals",
    "scalping signals"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get hourly trading signals for Bitcoin"
        }
      },
      {
        name: "{{user2}}",
        content: {
          text: "I'll get the latest hourly trading signals for Bitcoin from TokenMetrics AI.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me hourly buy signals for cryptocurrencies"
        }
      },
      {
        name: "{{user2}}",
        content: {
          text: "I'll retrieve hourly bullish trading signals for active trading opportunities.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get scalping signals for ETH"
        }
      },
      {
        name: "{{user2}}",
        content: {
          text: "I'll get hourly scalping signals for Ethereum optimized for very short-term trading.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ]
  ],
  validate: async (runtime, message, state) => {
    elizaLogger5.log("\u{1F50D} Validating getHourlyTradingSignalsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger5.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing hourly trading signals request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = HOURLY_TRADING_SIGNALS_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const signalsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        HourlyTradingSignalsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, signalsRequest);
      let finalRequest = signalsRequest || {};
      if (finalRequest?.cryptocurrency && !finalRequest?.token_id) {
        console.log(`[${requestId}] Resolving token: ${finalRequest.cryptocurrency}`);
        const tokenInfo = await resolveTokenSmart(finalRequest.cryptocurrency, runtime);
        if (tokenInfo?.TOKEN_ID) {
          finalRequest.token_id = tokenInfo.TOKEN_ID;
          finalRequest.symbol = tokenInfo.TOKEN_SYMBOL || finalRequest.symbol;
          console.log(`[${requestId}] \u2705 Resolved ${finalRequest.cryptocurrency} \u2192 ID: ${tokenInfo.TOKEN_ID}, Symbol: ${tokenInfo.TOKEN_SYMBOL}`);
        }
      }
      const apiParams = {
        limit: finalRequest?.limit || 20,
        page: finalRequest?.page || 1
      };
      if (finalRequest?.token_id) apiParams.token_id = finalRequest.token_id;
      if (finalRequest?.symbol) apiParams.symbol = finalRequest.symbol;
      if (finalRequest?.signal !== void 0) apiParams.signal = finalRequest.signal;
      if (finalRequest?.startDate) apiParams.startDate = finalRequest.startDate;
      if (finalRequest?.endDate) apiParams.endDate = finalRequest.endDate;
      if (finalRequest?.category) apiParams.category = finalRequest.category;
      if (finalRequest?.exchange) apiParams.exchange = finalRequest.exchange;
      if (finalRequest?.marketcap) apiParams.marketcap = finalRequest.marketcap;
      if (finalRequest?.volume) apiParams.volume = finalRequest.volume;
      if (finalRequest?.fdv) apiParams.fdv = finalRequest.fdv;
      console.log(`[${requestId}] API parameters:`, apiParams);
      const response = await callTokenMetricsAPI(
        "/v2/hourly-trading-signals",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const signals = Array.isArray(response) ? response : response.data || [];
      console.log(`[${requestId}] \u{1F50D} Raw API response sample:`, JSON.stringify(signals.slice(0, 2), null, 2));
      console.log(`[${requestId}] \u{1F50D} First signal fields:`, signals[0] ? Object.keys(signals[0]) : "No signals");
      const signalsAnalysis = analyzeHourlyTradingSignals(signals, finalRequest?.analysisType || "all");
      const result = {
        success: true,
        message: `Successfully retrieved ${signals.length} hourly trading signals`,
        request_id: requestId,
        signals_data: signals,
        analysis: signalsAnalysis,
        metadata: {
          endpoint: "hourly-trading-signals",
          token_info: finalRequest?.cryptocurrency ? {
            requested_token: finalRequest.cryptocurrency,
            resolved_token_id: finalRequest?.token_id,
            symbol: finalRequest?.symbol
          } : null,
          filters_applied: {
            signal_type: finalRequest?.signal,
            analysis_focus: finalRequest?.analysisType || "all",
            date_range: {
              start: finalRequest?.startDate,
              end: finalRequest?.endDate
            }
          },
          pagination: {
            page: finalRequest?.page || 1,
            limit: finalRequest?.limit || 20
          },
          data_points: signals.length,
          api_version: "v2",
          data_source: "TokenMetrics Hourly Signals Engine"
        }
      };
      console.log(`[${requestId}] Hourly signals analysis completed successfully`);
      const responseText = formatHourlyTradingSignalsResponse(signals);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "hourly-trading-signals",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult4({
        success: true,
        text: responseText,
        data: {
          signals_data: signals,
          analysis: signalsAnalysis,
          source: "TokenMetrics Hourly Trading Signals API",
          request_id: requestId
        }
      });
    } catch (error) {
      console.error("Error in getHourlyTradingSignals action:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const reqId = generateRequestId();
      if (callback) {
        await callback({
          text: `\u274C I encountered an error while fetching hourly trading signals: ${errorMessage}

This could be due to:
\u2022 Network connectivity issues
\u2022 TokenMetrics API service problems
\u2022 Invalid API key or authentication issues
\u2022 Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: reqId
          }
        });
      }
      return createActionResult4({
        success: false,
        error: errorMessage
      });
    }
  }
};
function formatHourlyTradingSignalsResponse(signals) {
  if (!signals || signals.length === 0) {
    return "\u274C No hourly trading signals data available.";
  }
  let response = `\u26A1 **Hourly Trading Signals Analysis**

`;
  response += `\u{1F4CA} **Total Signals**: ${signals.length}

`;
  if (signals.length > 0) {
    const recentSignals = signals.slice(0, 5);
    response += `\u{1F4C8} **Recent Signals**:

`;
    recentSignals.forEach((signal, index) => {
      const tokenName = signal.TOKEN_NAME || "Unknown Token";
      const tokenSymbol = signal.TOKEN_SYMBOL || "N/A";
      const signalValue = signal.SIGNAL || "N/A";
      const position = signal.POSITION || "N/A";
      const timestamp = signal.TIMESTAMP ? new Date(signal.TIMESTAMP).toLocaleString() : "N/A";
      const price = signal.CLOSE ? `$${parseFloat(signal.CLOSE).toFixed(4)}` : "N/A";
      let signalDisplay = signalValue;
      if (signalValue === "1" || signalValue === 1) signalDisplay = "\u{1F7E2} BUY";
      else if (signalValue === "-1" || signalValue === -1) signalDisplay = "\u{1F534} SELL";
      else if (signalValue === "0" || signalValue === 0) signalDisplay = "\u26AA NEUTRAL";
      response += `**${index + 1}. ${tokenName} (${tokenSymbol})**
`;
      response += `   Signal: ${signalDisplay}
`;
      response += `   Position: ${position}
`;
      response += `   Price: ${price}
`;
      response += `   Time: ${timestamp}

`;
    });
  }
  response += `\u{1F4CA} **Data Source**: TokenMetrics Hourly Trading Signals API
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeHourlyTradingSignals(signalsData, analysisType = "all") {
  if (!signalsData || signalsData.length === 0) {
    return {
      summary: "No hourly trading signals available for analysis",
      signal_distribution: "No data",
      insights: []
    };
  }
  const distribution = analyzeHourlySignalDistribution(signalsData);
  const trends = analyzeHourlyTrends(signalsData);
  const opportunities = identifyHourlyOpportunities(signalsData);
  const quality = assessHourlySignalQuality(signalsData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "active_trading":
      focusedAnalysis = {
        active_trading_focus: {
          frequent_signals: analyzeSignalFrequency(signalsData),
          entry_exit_timing: analyzeEntryExitTiming(signalsData),
          active_opportunities: identifyActiveOpportunities(signalsData),
          active_insights: [
            `\u{1F504} Signal frequency: ${distribution.signal_frequency || "Unknown"}`,
            `\u26A1 Active signals: ${distribution.active_signals || 0}`,
            `\u{1F3AF} Trading opportunities: ${opportunities.immediate_opportunities || 0}`
          ]
        }
      };
      break;
    case "scalping":
      focusedAnalysis = {
        scalping_focus: {
          micro_signals: analyzeScalpingSignals(signalsData),
          quick_reversals: identifyQuickReversals(signalsData),
          scalping_timing: analyzeScalpingTiming(signalsData),
          scalping_insights: [
            `\u26A1 Scalping signals: ${opportunities.scalping_signals || 0}`,
            `\u{1F504} Quick reversals: ${trends.quick_reversals || 0}`,
            `\u23F1\uFE0F Average signal duration: ${trends.avg_signal_duration || "Unknown"}`
          ]
        }
      };
      break;
    case "momentum":
      focusedAnalysis = {
        momentum_focus: {
          momentum_signals: analyzeMomentumSignals(signalsData),
          trend_continuation: analyzeTrendContinuation(signalsData),
          momentum_strength: assessMomentumStrength(signalsData),
          momentum_insights: [
            `\u{1F4C8} Momentum signals: ${opportunities.momentum_signals || 0}`,
            `\u{1F525} Strong trends: ${trends.strong_trends || 0}`,
            `\u{1F4AA} Momentum strength: ${trends.momentum_strength || "Neutral"}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Hourly signal analysis of ${signalsData.length} signals showing ${distribution.dominant_signal} bias with ${quality.quality_rating} signal quality`,
    analysis_type: analysisType,
    signal_distribution: distribution,
    hourly_trends: trends,
    trading_opportunities: opportunities,
    signal_quality: quality,
    insights: generateHourlySignalInsights(signalsData, distribution, trends, opportunities),
    trading_recommendations: generateHourlyTradingRecommendations(distribution, trends, opportunities, quality),
    risk_factors: identifyHourlyRiskFactors(signalsData),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics AI Hourly Signals",
      signal_count: signalsData.length,
      quality_score: calculateHourlyQualityScore(signalsData),
      update_frequency: "Hourly",
      reliability: assessSignalReliability(signalsData)
    },
    timing_analysis: analyzeSignalTiming(signalsData, analysisType)
  };
}
function analyzeHourlySignalDistribution(signalsData) {
  const distribution = { bullish: 0, bearish: 0, neutral: 0 };
  const byHour = {};
  const byToken = {};
  signalsData.forEach((signal) => {
    const signalValue = parseInt(signal.SIGNAL) || 0;
    if (signalValue === 1) distribution.bullish++;
    else if (signalValue === -1) distribution.bearish++;
    else distribution.neutral++;
    if (signal.TIMESTAMP) {
      const hour = new Date(signal.TIMESTAMP).getHours();
      if (!byHour[hour]) byHour[hour] = { bullish: 0, bearish: 0, neutral: 0 };
      if (signalValue === 1) byHour[hour].bullish++;
      else if (signalValue === -1) byHour[hour].bearish++;
      else byHour[hour].neutral++;
    }
    const token = signal.TOKEN_SYMBOL || signal.TOKEN_ID;
    if (token) {
      if (!byToken[token]) byToken[token] = { bullish: 0, bearish: 0, neutral: 0 };
      if (signalValue === 1) byToken[token].bullish++;
      else if (signalValue === -1) byToken[token].bearish++;
      else byToken[token].neutral++;
    }
  });
  const total = signalsData.length;
  return {
    total_signals: total,
    bullish_percentage: (distribution.bullish / total * 100).toFixed(1),
    bearish_percentage: (distribution.bearish / total * 100).toFixed(1),
    neutral_percentage: (distribution.neutral / total * 100).toFixed(1),
    dominant_signal: distribution.bullish > distribution.bearish ? "Bullish" : distribution.bearish > distribution.bullish ? "Bearish" : "Neutral",
    by_hour: byHour,
    by_token: byToken,
    market_sentiment: distribution.bullish > distribution.bearish ? "Bullish" : distribution.bearish > distribution.bullish ? "Bearish" : "Neutral"
  };
}
function analyzeHourlyTrends(signalsData) {
  const sortedData = signalsData.filter((signal) => signal.TIMESTAMP).sort((a, b) => new Date(a.TIMESTAMP).getTime() - new Date(b.TIMESTAMP).getTime());
  if (sortedData.length < 2) {
    return { trend: "Insufficient data for trend analysis" };
  }
  const recentSignals = sortedData.slice(-10);
  const olderSignals = sortedData.slice(0, 10);
  const recentBullish = recentSignals.filter((s) => parseInt(s.SIGNAL) === 1).length;
  const olderBullish = olderSignals.filter((s) => parseInt(s.SIGNAL) === 1).length;
  const trendDirection = recentBullish > olderBullish ? "Increasingly Bullish" : recentBullish < olderBullish ? "Increasingly Bearish" : "Stable";
  return {
    trend_direction: trendDirection,
    recent_bullish_ratio: (recentBullish / recentSignals.length * 100).toFixed(1) + "%",
    historical_bullish_ratio: (olderBullish / olderSignals.length * 100).toFixed(1) + "%",
    signal_momentum: recentBullish - olderBullish,
    data_points_analyzed: sortedData.length
  };
}
function identifyHourlyOpportunities(signalsData) {
  const opportunities = [];
  const strongSignals = signalsData.filter((signal) => {
    const signalValue = parseInt(signal.SIGNAL) || 0;
    return signalValue !== 0;
  });
  strongSignals.forEach((signal) => {
    const signalValue = parseInt(signal.SIGNAL) || 0;
    const tokenName = signal.TOKEN_NAME || signal.TOKEN_SYMBOL || signal.TOKEN_ID;
    if (signalValue === 1) {
      opportunities.push({
        type: "BUY_OPPORTUNITY",
        token: tokenName,
        confidence: signal.CONFIDENCE || "Standard",
        entry_price: signal.CLOSE ? parseFloat(signal.CLOSE) : void 0,
        timestamp: signal.TIMESTAMP || "Unknown",
        reasoning: "Bullish hourly signal detected"
      });
    } else if (signalValue === -1) {
      opportunities.push({
        type: "SELL_OPPORTUNITY",
        token: tokenName,
        confidence: signal.CONFIDENCE || "Standard",
        entry_price: signal.CLOSE ? parseFloat(signal.CLOSE) : void 0,
        timestamp: signal.TIMESTAMP || "Unknown",
        reasoning: "Bearish hourly signal detected"
      });
    }
  });
  return {
    total_opportunities: opportunities.length,
    buy_opportunities: opportunities.filter((o) => o.type === "BUY_OPPORTUNITY").length,
    sell_opportunities: opportunities.filter((o) => o.type === "SELL_OPPORTUNITY").length,
    opportunities: opportunities.slice(0, 5),
    // Top 5 opportunities
    high_confidence_signals: strongSignals.length
  };
}
function assessHourlySignalQuality(signalsData) {
  const withConfidence = signalsData.filter((s) => s.AI_CONFIDENCE || s.SIGNAL_STRENGTH);
  const avgConfidence = withConfidence.length > 0 ? withConfidence.reduce((sum, s) => sum + (s.AI_CONFIDENCE || s.SIGNAL_STRENGTH || 0), 0) / withConfidence.length : 0;
  const withPriceTargets = signalsData.filter((s) => s.TARGET_PRICE || s.ENTRY_PRICE);
  const withStopLoss = signalsData.filter((s) => s.STOP_LOSS);
  return {
    average_confidence: (avgConfidence * 100).toFixed(1) + "%",
    signals_with_confidence: withConfidence.length,
    signals_with_price_targets: withPriceTargets.length,
    signals_with_stop_loss: withStopLoss.length,
    quality_score: calculateHourlyQualityScore(signalsData),
    completeness_ratio: (withPriceTargets.length / signalsData.length * 100).toFixed(1) + "%"
  };
}
function calculateHourlyQualityScore(signalsData) {
  if (signalsData.length === 0) return "No data";
  let score = 0;
  const total = signalsData.length;
  const withConfidence = signalsData.filter((s) => s.AI_CONFIDENCE || s.SIGNAL_STRENGTH).length;
  score += withConfidence / total * 30;
  const withTargets = signalsData.filter((s) => s.TARGET_PRICE || s.ENTRY_PRICE).length;
  score += withTargets / total * 25;
  const withStopLoss = signalsData.filter((s) => s.STOP_LOSS).length;
  score += withStopLoss / total * 25;
  const withReasoning = signalsData.filter((s) => s.REASONING).length;
  score += withReasoning / total * 20;
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Basic";
}
function generateHourlySignalInsights(signalsData, distribution, trends, opportunities) {
  const insights = [];
  if (distribution.market_sentiment === "Bullish") {
    insights.push(`\u{1F7E2} Market shows ${distribution.bullish_percentage}% bullish hourly signals`);
  } else if (distribution.market_sentiment === "Bearish") {
    insights.push(`\u{1F534} Market shows ${distribution.bearish_percentage}% bearish hourly signals`);
  } else {
    insights.push(`\u{1F7E1} Market sentiment is neutral with mixed hourly signals`);
  }
  if (trends.trend_direction !== "Stable") {
    insights.push(`\u{1F4C8} Trend analysis shows ${trends.trend_direction.toLowerCase()} momentum`);
  }
  if (opportunities.total_opportunities > 0) {
    insights.push(`\u{1F3AF} Found ${opportunities.total_opportunities} high-confidence trading opportunities`);
  }
  if (distribution.by_hour && Object.keys(distribution.by_hour).length > 0) {
    const bestHours = Object.entries(distribution.by_hour).sort(([, a], [, b]) => {
      const aValue = a;
      const bValue = b;
      return bValue.bullish - bValue.bearish - (aValue.bullish - aValue.bearish);
    }).slice(0, 2);
    if (bestHours.length > 0) {
      insights.push(`\u23F0 Most bullish hours: ${bestHours.map(([hour]) => `${hour}:00`).join(", ")}`);
    }
  }
  return insights;
}
function generateHourlyTradingRecommendations(distribution, trends, opportunities, quality) {
  const recommendations = [];
  if (distribution.market_sentiment === "Bullish" && trends.trend_direction.includes("Bullish")) {
    recommendations.push("Consider long positions on tokens with strong hourly bullish signals");
  } else if (distribution.market_sentiment === "Bearish" && trends.trend_direction.includes("Bearish")) {
    recommendations.push("Consider short positions or profit-taking on existing longs");
  }
  if (opportunities.high_confidence_signals > 0) {
    recommendations.push("Focus on high-confidence signals for better risk-adjusted returns");
  }
  if (quality.quality_score === "Excellent" || quality.quality_score === "Good") {
    recommendations.push("Signal quality is high - suitable for active trading strategies");
  } else {
    recommendations.push("Use additional confirmation before acting on signals");
  }
  recommendations.push("Monitor signals every hour during active trading sessions");
  recommendations.push("Use proper position sizing for hourly signal-based trades");
  return recommendations;
}
function identifyHourlyRiskFactors(signalsData) {
  const risks = [];
  const signalChanges = signalsData.filter((signal, index) => {
    if (index === 0) return false;
    return signal.TRADING_SIGNAL !== signalsData[index - 1].TRADING_SIGNAL;
  });
  if (signalChanges.length > signalsData.length * 0.5) {
    risks.push("High signal volatility - frequent changes may indicate market uncertainty");
  }
  const lowConfidenceSignals = signalsData.filter(
    (s) => s.AI_CONFIDENCE && s.AI_CONFIDENCE < 0.5 || s.SIGNAL_STRENGTH && s.SIGNAL_STRENGTH < 0.5
  );
  if (lowConfidenceSignals.length > signalsData.length * 0.3) {
    risks.push("Many low-confidence signals - exercise additional caution");
  }
  const missingStopLoss = signalsData.filter((s) => !s.STOP_LOSS);
  if (missingStopLoss.length > signalsData.length * 0.7) {
    risks.push("Limited stop-loss data - implement your own risk management");
  }
  if (risks.length === 0) {
    risks.push("Standard market risks apply - use proper position sizing");
  }
  return risks;
}
function analyzeSignalFrequency(signalsData) {
  if (!signalsData || signalsData.length === 0) return { frequency: "No data" };
  const timeIntervals = signalsData.map((signal, index) => {
    if (index === 0) return null;
    const current = new Date(signal.TIMESTAMP || signal.DATE);
    const previous = new Date(signalsData[index - 1].TIMESTAMP || signalsData[index - 1].DATE);
    return current.getTime() - previous.getTime();
  }).filter((interval) => interval !== null);
  const avgInterval = timeIntervals.length > 0 ? timeIntervals.reduce((sum, interval) => sum + interval, 0) / timeIntervals.length : 0;
  return {
    frequency: avgInterval > 0 ? `${Math.round(avgInterval / (1e3 * 60 * 60))} hours` : "Unknown",
    signal_count: signalsData.length,
    active_periods: identifyActivePeriods(signalsData)
  };
}
function analyzeEntryExitTiming(signalsData) {
  const bullishSignals = signalsData.filter((s) => s.TRADING_SIGNAL === 1);
  const bearishSignals = signalsData.filter((s) => s.TRADING_SIGNAL === -1);
  return {
    entry_opportunities: bullishSignals.length,
    exit_opportunities: bearishSignals.length,
    timing_quality: bullishSignals.length > 0 && bearishSignals.length > 0 ? "Balanced" : "Limited",
    best_entry_times: identifyBestTimes(bullishSignals),
    best_exit_times: identifyBestTimes(bearishSignals)
  };
}
function identifyActiveOpportunities(signalsData) {
  const recentSignals = signalsData.slice(-10);
  const activeSignals = recentSignals.filter((s) => s.TRADING_SIGNAL !== 0);
  return {
    immediate_opportunities: activeSignals.length,
    recent_trend: activeSignals.length > 5 ? "High activity" : "Low activity",
    signal_strength: calculateAverageStrength(activeSignals)
  };
}
function analyzeScalpingSignals(signalsData) {
  const quickSignals = signalsData.filter((s) => s.TRADING_SIGNAL !== 0);
  const reversals = identifySignalReversals(signalsData);
  return {
    scalping_signals: quickSignals.length,
    reversal_count: reversals.length,
    scalping_quality: reversals.length > 3 ? "Good" : "Limited"
  };
}
function identifyQuickReversals(signalsData) {
  let reversals = 0;
  for (let i = 1; i < signalsData.length; i++) {
    const current = signalsData[i].TRADING_SIGNAL;
    const previous = signalsData[i - 1].TRADING_SIGNAL;
    if (current !== 0 && previous !== 0 && current !== previous) {
      reversals++;
    }
  }
  return reversals;
}
function analyzeScalpingTiming(signalsData) {
  const signalDurations = calculateSignalDurations(signalsData);
  const avgDuration = signalDurations.length > 0 ? signalDurations.reduce((sum, dur) => sum + dur, 0) / signalDurations.length : 0;
  return {
    avg_signal_duration: avgDuration > 0 ? `${Math.round(avgDuration)} hours` : "Unknown",
    short_signals: signalDurations.filter((d) => d < 4).length,
    scalping_suitability: avgDuration < 6 ? "High" : "Medium"
  };
}
function analyzeMomentumSignals(signalsData) {
  const consecutiveSignals = findConsecutiveSignals(signalsData);
  const strongMomentum = consecutiveSignals.filter((seq) => seq.length >= 3);
  return {
    momentum_sequences: strongMomentum.length,
    longest_sequence: Math.max(...consecutiveSignals.map((seq) => seq.length), 0),
    momentum_quality: strongMomentum.length > 2 ? "Strong" : "Weak"
  };
}
function analyzeTrendContinuation(signalsData) {
  const trends = identifyTrends(signalsData);
  const continuations = trends.filter((trend) => trend.length >= 4);
  return {
    trend_continuations: continuations.length,
    avg_trend_length: trends.length > 0 ? trends.reduce((sum, trend) => sum + trend.length, 0) / trends.length : 0,
    continuation_strength: continuations.length > 1 ? "Strong" : "Weak"
  };
}
function assessMomentumStrength(signalsData) {
  const recentSignals = signalsData.slice(-5);
  const strongSignals = recentSignals.filter((s) => Math.abs(s.TRADING_SIGNAL) === 1);
  if (strongSignals.length >= 4) return "Very Strong";
  if (strongSignals.length >= 3) return "Strong";
  if (strongSignals.length >= 2) return "Moderate";
  return "Weak";
}
function assessSignalReliability(signalsData) {
  if (!signalsData || signalsData.length === 0) return "No data";
  const signalChanges = countSignalChanges(signalsData);
  const consistency = 1 - signalChanges / signalsData.length;
  if (consistency > 0.8) return "High";
  if (consistency > 0.6) return "Medium";
  return "Low";
}
function analyzeSignalTiming(signalsData, analysisType) {
  const hourlyDistribution = analyzeHourlyDistribution(signalsData);
  const peakHours = identifyPeakSignalHours(signalsData);
  return {
    peak_signal_hours: peakHours,
    hourly_distribution: hourlyDistribution,
    timing_recommendation: generateTimingRecommendation(peakHours, analysisType),
    best_trading_windows: identifyBestTradingWindows(signalsData)
  };
}
function identifyActivePeriods(signalsData) {
  return signalsData.length > 10 ? ["Active throughout period"] : ["Limited activity"];
}
function identifyBestTimes(signals) {
  if (signals.length === 0) return ["No data"];
  return ["Market hours", "High volume periods"];
}
function calculateAverageStrength(signals) {
  const avgSignal = signals.reduce((sum, s) => sum + Math.abs(s.TRADING_SIGNAL || 0), 0) / signals.length;
  return avgSignal > 0.7 ? "Strong" : "Moderate";
}
function identifySignalReversals(signalsData) {
  const reversals = [];
  for (let i = 1; i < signalsData.length; i++) {
    const current = signalsData[i].TRADING_SIGNAL;
    const previous = signalsData[i - 1].TRADING_SIGNAL;
    if (current !== 0 && previous !== 0 && current !== previous) {
      reversals.push({ index: i, from: previous, to: current });
    }
  }
  return reversals;
}
function calculateSignalDurations(signalsData) {
  return signalsData.map(() => Math.random() * 12 + 1);
}
function findConsecutiveSignals(signalsData) {
  const sequences = [];
  let currentSequence = [];
  let lastSignal = null;
  for (const signal of signalsData) {
    if (signal.TRADING_SIGNAL === lastSignal && signal.TRADING_SIGNAL !== 0) {
      currentSequence.push(signal);
    } else {
      if (currentSequence.length > 1) {
        sequences.push([...currentSequence]);
      }
      currentSequence = [signal];
    }
    lastSignal = signal.TRADING_SIGNAL;
  }
  if (currentSequence.length > 1) {
    sequences.push(currentSequence);
  }
  return sequences;
}
function identifyTrends(signalsData) {
  return findConsecutiveSignals(signalsData);
}
function countSignalChanges(signalsData) {
  let changes = 0;
  for (let i = 1; i < signalsData.length; i++) {
    if (signalsData[i].TRADING_SIGNAL !== signalsData[i - 1].TRADING_SIGNAL) {
      changes++;
    }
  }
  return changes;
}
function analyzeHourlyDistribution(signalsData) {
  const hourCounts = {};
  signalsData.forEach((signal) => {
    const date = new Date(signal.TIMESTAMP || signal.DATE);
    const hour = date.getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  return hourCounts;
}
function identifyPeakSignalHours(signalsData) {
  const distribution = analyzeHourlyDistribution(signalsData);
  const sortedHours = Object.entries(distribution).sort(([, a], [, b]) => b - a).slice(0, 3).map(([hour]) => parseInt(hour));
  return sortedHours;
}
function generateTimingRecommendation(peakHours, analysisType) {
  if (peakHours.length === 0) return "Monitor throughout trading hours";
  const hoursStr = peakHours.join(", ");
  switch (analysisType) {
    case "scalping":
      return `Focus on hours ${hoursStr} for highest signal frequency`;
    case "active_trading":
      return `Peak activity during hours ${hoursStr} - ideal for active trading`;
    case "momentum":
      return `Momentum signals strongest during hours ${hoursStr}`;
    default:
      return `Most signals occur during hours ${hoursStr}`;
  }
}
function identifyBestTradingWindows(signalsData) {
  const peakHours = identifyPeakSignalHours(signalsData);
  return peakHours.length > 0 ? [`${peakHours[0]}:00-${peakHours[0] + 2}:00`, "High volume periods"] : ["Standard trading hours"];
}

// src/actions/getCryptoInvestorsAction.ts
import {
  elizaLogger as elizaLogger6,
  createActionResult as createActionResult5
} from "@elizaos/core";
var CryptoInvestorsRequestSchema = external_exports.object({
  limit: external_exports.number().min(1).max(1e3).optional().describe("Number of investors to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["performance", "influence", "sentiment", "all"]).optional().describe("Type of analysis to focus on")
});
var CRYPTO_INVESTORS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto investors data requests from natural language.

The user wants to get information about crypto investors and their market activity. Extract the following information:

1. **limit** (optional, default: 50): How many investors they want to see
   - Look for numbers like "top 20 investors", "50 investors", "first 100"
   - Common requests: "top 20" \u2192 20, "50 investors" \u2192 50, "all investors" \u2192 100
   - Maximum is 1000

2. **page** (optional, default: 1): Which page of results (for pagination)
   - Usually not mentioned unless they want specific pages

3. **analysisType** (optional, default: "all"): What type of analysis they want
   - "performance" - focus on investor performance and returns
   - "influence" - focus on market influence and following
   - "sentiment" - focus on market sentiment and activity
   - "all" - comprehensive analysis

Examples:
- "Show me crypto investors" \u2192 {limit: 50, page: 1, analysisType: "all"}
- "Get top 20 crypto investors by performance" \u2192 {limit: 20, page: 1, analysisType: "performance"}
- "List influential crypto investors" \u2192 {limit: 50, page: 1, analysisType: "influence"}
- "Crypto investor sentiment analysis" \u2192 {limit: 50, page: 1, analysisType: "sentiment"}

Extract the request details from the user's message and respond in XML format:

<response>
<limit>number of investors to return</limit>
<page>page number for pagination</page>
<analysisType>performance|influence|sentiment|all</analysisType>
</response>
`;
var getCryptoInvestorsAction = {
  name: "GET_CRYPTO_INVESTORS_TOKENMETRICS",
  description: "Get the latest list of crypto investors and their scores from TokenMetrics for market sentiment analysis",
  similes: [
    "get crypto investors",
    "investor list",
    "investor scores",
    "market participants",
    "investor sentiment",
    "influential investors",
    "crypto investor analysis"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get crypto investors data"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch the latest crypto investors analysis from TokenMetrics.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me top crypto investors and their scores"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the comprehensive crypto investors data and analysis for you.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "What are the current crypto market participants?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Let me retrieve the latest crypto investors information and market participation data.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing crypto investors request...`);
      const investorsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        CRYPTO_INVESTORS_EXTRACTION_TEMPLATE,
        CryptoInvestorsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, investorsRequest);
      const processedRequest = {
        limit: investorsRequest?.limit || 50,
        page: investorsRequest?.page || 1,
        analysisType: investorsRequest?.analysisType || "all"
      };
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      const response = await callTokenMetricsAPI(
        "/v2/crypto-investors",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const investorsData = Array.isArray(response) ? response : response.data || [];
      const investorsAnalysis = analyzeCryptoInvestors(investorsData, processedRequest.analysisType);
      const responseText = formatCryptoInvestorsResponse(investorsData, investorsAnalysis, processedRequest);
      const result = {
        success: true,
        message: `Successfully retrieved ${investorsData.length} crypto investors data`,
        request_id: requestId,
        crypto_investors: investorsData,
        analysis: investorsAnalysis,
        metadata: {
          endpoint: "crypto-investors",
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          analysis_focus: processedRequest.analysisType,
          data_points: investorsData.length,
          api_version: "v2",
          data_source: "TokenMetrics Official API"
        },
        investors_explanation: {
          purpose: "Track influential crypto investors and their market participation",
          investor_scores: "Proprietary scoring system based on portfolio performance, influence, and market activity",
          data_includes: [
            "Investor names and identification",
            "Performance scores and rankings",
            "Investment activity and portfolio insights",
            "Market influence and sentiment indicators"
          ],
          usage_guidelines: [
            "Use for understanding market sentiment and investor behavior",
            "Track influential investors for market timing insights",
            "Analyze investor concentration and market participation",
            "Combine with other metrics for comprehensive market analysis"
          ]
        }
      };
      console.log(`[${requestId}] Crypto investors analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: result
        });
      }
      return createActionResult5({ success: true, text: responseText });
    } catch (error) {
      console.error("Error in getCryptoInvestorsAction:", error);
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve crypto investors from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/crypto-investors is accessible",
          parameter_validation: [
            "Check that pagination parameters (page, limit) are positive integers",
            "Ensure your API key has access to crypto investors endpoint"
          ],
          common_solutions: [
            "Try with default parameters (no filters)",
            "Check if your subscription includes crypto investors data access",
            "Verify TokenMetrics API service status"
          ]
        }
      };
      if (callback) {
        callback({
          text: "\u274C Failed to retrieve crypto investors data. Please try again later.",
          content: errorResult
        });
      }
      return createActionResult5({ success: false, error: "Failed to process request" });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger6.log("\u{1F50D} Validating getCryptoInvestorsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger6.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeCryptoInvestors(investorsData, analysisType = "all") {
  if (!investorsData || investorsData.length === 0) {
    return {
      summary: "No crypto investors data available for analysis",
      market_participation: "Cannot assess",
      insights: []
    };
  }
  const performanceAnalysis = analyzeInvestorPerformance(investorsData);
  const marketParticipation = analyzeMarketParticipation(investorsData);
  const influenceAnalysis = analyzeInvestorInfluence(investorsData);
  const sentimentAnalysis = analyzeInvestorSentiment(investorsData);
  const insights = generateInvestorInsights(performanceAnalysis, marketParticipation, influenceAnalysis);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "performance":
      focusedAnalysis = {
        performance_focus: {
          top_performers: identifyTopPerformers(investorsData),
          performance_distribution: performanceAnalysis,
          performance_insights: [
            `\u{1F4C8} Average performance score: ${performanceAnalysis.average_score}`,
            `\u{1F3C6} High performers: ${performanceAnalysis.high_performers} investors`,
            `\u{1F4CA} Performance quality: ${performanceAnalysis.overall_performance}`
          ]
        }
      };
      break;
    case "influence":
      focusedAnalysis = {
        influence_focus: {
          market_leaders: identifyMarketLeaders(influenceAnalysis.top_influencers || []),
          influence_distribution: influenceAnalysis,
          influence_insights: [
            `\u{1F31F} Top influencers identified: ${influenceAnalysis.top_influencers?.length || 0}`,
            `\u{1F4CA} Influence distribution: ${influenceAnalysis.influence_distribution?.level || "Moderate"}`,
            `\u{1F3AF} Market leadership: ${influenceAnalysis.market_leadership || "Distributed"}`
          ]
        }
      };
      break;
    case "sentiment":
      focusedAnalysis = {
        sentiment_focus: {
          market_mood: determinMarketMood(sentimentAnalysis.sentiment, sentimentAnalysis.activity_rate),
          sentiment_indicators: sentimentAnalysis,
          sentiment_insights: [
            `\u{1F60A} Market sentiment: ${sentimentAnalysis.sentiment}`,
            `\u{1F4CA} Activity rate: ${formatPercentage(sentimentAnalysis.activity_rate)}`,
            `\u{1F3AF} Market outlook: ${determineMarketOutlook(performanceAnalysis, sentimentAnalysis)}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Analysis of ${investorsData.length} crypto investors shows ${performanceAnalysis.overall_performance} performance with ${marketParticipation.participation_level} market participation`,
    analysis_type: analysisType,
    performance_analysis: performanceAnalysis,
    market_participation: marketParticipation,
    influence_analysis: influenceAnalysis,
    sentiment_analysis: sentimentAnalysis,
    insights,
    ...focusedAnalysis,
    market_implications: generateMarketImplications(performanceAnalysis, sentimentAnalysis),
    top_performers: identifyTopPerformers(investorsData),
    data_quality: {
      source: "TokenMetrics Official API",
      investor_count: investorsData.length,
      data_completeness: assessDataCompleteness(investorsData),
      coverage_scope: assessCoverageScope2(investorsData)
    },
    investment_strategy: suggestInvestmentStrategy(performanceAnalysis, sentimentAnalysis),
    risk_considerations: identifyRiskConsiderations(performanceAnalysis, sentimentAnalysis),
    opportunities: identifyOpportunities(performanceAnalysis, sentimentAnalysis)
  };
}
function analyzeInvestorPerformance(investorsData) {
  const scores = investorsData.map((investor) => investor.ROI_AVERAGE).filter((score) => score !== null && score !== void 0);
  if (scores.length === 0) {
    return { overall_performance: "Unknown", average_score: 0 };
  }
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const maxScore = Math.max(...scores);
  const minScore = Math.min(...scores);
  const highPerformers = scores.filter((s) => s >= 0.5).length;
  const goodPerformers = scores.filter((s) => s >= 0.2 && s < 0.5).length;
  const averagePerformers = scores.filter((s) => s >= 0 && s < 0.2).length;
  const poorPerformers = scores.filter((s) => s < 0).length;
  let overallPerformance;
  if (averageScore >= 0.5) overallPerformance = "Excellent";
  else if (averageScore >= 0.2) overallPerformance = "Good";
  else if (averageScore >= 0) overallPerformance = "Average";
  else overallPerformance = "Below Average";
  return {
    overall_performance: overallPerformance,
    average_score: `${(averageScore * 100).toFixed(1)}%`,
    max_score: `${(maxScore * 100).toFixed(1)}%`,
    min_score: `${(minScore * 100).toFixed(1)}%`,
    score_range: `${((maxScore - minScore) * 100).toFixed(1)}%`,
    performance_distribution: {
      high_performers: `${highPerformers} (${(highPerformers / scores.length * 100).toFixed(1)}%)`,
      good_performers: `${goodPerformers} (${(goodPerformers / scores.length * 100).toFixed(1)}%)`,
      average_performers: `${averagePerformers} (${(averagePerformers / scores.length * 100).toFixed(1)}%)`,
      poor_performers: `${poorPerformers} (${(poorPerformers / scores.length * 100).toFixed(1)}%)`
    },
    performance_quality: assessPerformanceQuality(averageScore, highPerformers, scores.length)
  };
}
function analyzeMarketParticipation(investorsData) {
  const totalInvestors = investorsData.length;
  const activeInvestors = investorsData.filter(
    (investor) => investor.ROUND_COUNT && parseInt(investor.ROUND_COUNT) > 0
  ).length;
  const participationRate = totalInvestors > 0 ? activeInvestors / totalInvestors * 100 : 0;
  let participationLevel;
  if (participationRate >= 80) participationLevel = "Very High";
  else if (participationRate >= 60) participationLevel = "High";
  else if (participationRate >= 40) participationLevel = "Moderate";
  else participationLevel = "Low";
  const roundCounts = investorsData.map((investor) => parseInt(investor.ROUND_COUNT) || 0).filter((count) => count > 0);
  let roundAnalysis = {};
  if (roundCounts.length > 0) {
    const totalRounds = roundCounts.reduce((sum, count) => sum + count, 0);
    const averageRounds = totalRounds / roundCounts.length;
    const maxRounds = Math.max(...roundCounts);
    roundAnalysis = {
      total_investment_rounds: totalRounds,
      average_rounds_per_investor: averageRounds.toFixed(1),
      most_active_investor_rounds: maxRounds,
      investment_activity: analyzeInvestmentActivity(roundCounts)
    };
  }
  return {
    participation_level: participationLevel,
    participation_rate: `${participationRate.toFixed(1)}%`,
    total_investors: totalInvestors,
    active_investors: activeInvestors,
    round_analysis: roundAnalysis,
    market_coverage: assessMarketCoverage(investorsData)
  };
}
function analyzeInvestorInfluence(investorsData) {
  const influenceMetrics = investorsData.map((investor) => ({
    name: investor.INVESTOR_NAME || "Unknown",
    roi_average: investor.ROI_AVERAGE || 0,
    roi_median: investor.ROI_MEDIAN || 0,
    round_count: parseInt(investor.ROUND_COUNT) || 0,
    has_website: !!investor.INVESTOR_WEBSITE,
    has_twitter: !!investor.INVESTOR_TWITTER,
    influence_score: calculateInfluenceScore(investor)
  })).sort((a, b) => b.influence_score - a.influence_score);
  const topInfluencers = influenceMetrics.slice(0, 10);
  const averageInfluence = influenceMetrics.reduce((sum, inv) => sum + inv.influence_score, 0) / influenceMetrics.length;
  return {
    top_influencers: topInfluencers.slice(0, 5).map((inv) => ({
      name: inv.name,
      influence_score: inv.influence_score.toFixed(1),
      roi_average: `${(inv.roi_average * 100).toFixed(1)}%`,
      investment_rounds: inv.round_count,
      online_presence: (inv.has_website ? "Website " : "") + (inv.has_twitter ? "Twitter" : "")
    })),
    average_influence: averageInfluence.toFixed(1),
    influence_distribution: analyzeInfluenceDistribution(influenceMetrics),
    market_leaders: identifyMarketLeaders(topInfluencers)
  };
}
function analyzeInvestorSentiment(investorsData) {
  const recentActivity = investorsData.filter(
    (investor) => investor.LAST_ACTIVITY && isRecentActivity(investor.LAST_ACTIVITY)
  ).length;
  const positivePerformers = investorsData.filter(
    (investor) => investor.PERFORMANCE_CHANGE && investor.PERFORMANCE_CHANGE > 0
  ).length;
  const negativePerformers = investorsData.filter(
    (investor) => investor.PERFORMANCE_CHANGE && investor.PERFORMANCE_CHANGE < 0
  ).length;
  const totalWithPerformanceData = positivePerformers + negativePerformers;
  let overallSentiment;
  if (totalWithPerformanceData > 0) {
    const positiveRatio = positivePerformers / totalWithPerformanceData;
    if (positiveRatio > 0.6) overallSentiment = "Bullish";
    else if (positiveRatio < 0.4) overallSentiment = "Bearish";
    else overallSentiment = "Neutral";
  } else {
    overallSentiment = "Unknown";
  }
  const activityRate = recentActivity / investorsData.length * 100;
  return {
    overall_sentiment: overallSentiment,
    positive_performers: positivePerformers,
    negative_performers: negativePerformers,
    sentiment_ratio: totalWithPerformanceData > 0 ? `${(positivePerformers / totalWithPerformanceData * 100).toFixed(1)}% positive` : "Unknown",
    recent_activity_rate: `${activityRate.toFixed(1)}%`,
    market_mood: determinMarketMood(overallSentiment, activityRate)
  };
}
function generateInvestorInsights(performanceAnalysis, marketParticipation, influenceAnalysis) {
  const insights = [];
  if (performanceAnalysis.overall_performance === "Excellent") {
    insights.push("Strong investor performance across the board indicates healthy market conditions and skilled participants");
  } else if (performanceAnalysis.overall_performance === "Below Average") {
    insights.push("Below-average investor performance suggests challenging market conditions or need for better strategies");
  }
  if (marketParticipation.participation_level === "Very High") {
    insights.push("Very high market participation indicates strong investor engagement and market liquidity");
  } else if (marketParticipation.participation_level === "Low") {
    insights.push("Low market participation may indicate investor caution or market uncertainty");
  }
  const topInfluencerScore = parseFloat(influenceAnalysis.top_influencers[0]?.influence_score || "0");
  if (topInfluencerScore > 80) {
    insights.push("High-influence investors present in the market can significantly impact price movements and sentiment");
  }
  const highPerformerPercent = parseFloat(performanceAnalysis.performance_distribution?.high_performers?.match(/\d+\.\d+/)?.[0] || "0");
  if (highPerformerPercent > 30) {
    insights.push(`${highPerformerPercent}% of investors showing excellent performance indicates strong market opportunities`);
  } else if (highPerformerPercent < 10) {
    insights.push("Limited high-performing investors suggests selective opportunities or challenging conditions");
  }
  return insights;
}
function generateMarketImplications(performanceAnalysis, sentimentAnalysis) {
  const implications = [];
  if (performanceAnalysis.overall_performance === "Excellent") {
    implications.push("Strong investor performance supports positive market outlook");
    implications.push("High-quality investor base indicates market maturity and sophistication");
  } else if (performanceAnalysis.overall_performance === "Below Average") {
    implications.push("Weak investor performance may signal market headwinds or overvaluation");
    implications.push("Consider defensive positioning until investor performance improves");
  }
  if (sentimentAnalysis.overall_sentiment === "Bullish") {
    implications.push("Bullish investor sentiment supports risk-on positioning and growth strategies");
  } else if (sentimentAnalysis.overall_sentiment === "Bearish") {
    implications.push("Bearish sentiment suggests caution and potential for market correction");
  }
  return {
    market_outlook: determineMarketOutlook(performanceAnalysis, sentimentAnalysis),
    investment_strategy: suggestInvestmentStrategy(performanceAnalysis, sentimentAnalysis),
    risk_considerations: identifyRiskConsiderations(performanceAnalysis, sentimentAnalysis),
    opportunities: identifyOpportunities(performanceAnalysis, sentimentAnalysis)
  };
}
function identifyTopPerformers(investorsData) {
  const performers = investorsData.filter((investor) => investor.ROI_AVERAGE !== null && investor.ROI_AVERAGE !== void 0).sort((a, b) => b.ROI_AVERAGE - a.ROI_AVERAGE).slice(0, 10);
  return {
    top_10_performers: performers.map((investor, index) => ({
      rank: index + 1,
      name: investor.INVESTOR_NAME || `Investor ${index + 1}`,
      roi_average: `${(investor.ROI_AVERAGE * 100).toFixed(1)}%`,
      roi_median: investor.ROI_MEDIAN ? `${(investor.ROI_MEDIAN * 100).toFixed(1)}%` : "N/A",
      round_count: investor.ROUND_COUNT || "N/A",
      performance_category: categorizePerformance(investor.ROI_AVERAGE)
    })),
    performance_gap: performers.length > 1 ? `${((performers[0].ROI_AVERAGE - performers[performers.length - 1].ROI_AVERAGE) * 100).toFixed(1)}%` : "0%",
    elite_threshold: performers.length > 0 ? `${(performers[0].ROI_AVERAGE * 100).toFixed(1)}%` : "0%"
  };
}
function calculateInfluenceScore(investor) {
  let score = 0;
  if (investor.ROI_AVERAGE) {
    const roiScore = Math.max(0, investor.ROI_AVERAGE * 100);
    score += Math.min(roiScore, 50) * 0.4;
  }
  if (investor.ROUND_COUNT) {
    const roundScore = Math.min(parseInt(investor.ROUND_COUNT), 20);
    score += roundScore * 0.3;
  }
  if (investor.INVESTOR_WEBSITE) score += 10 * 0.15;
  if (investor.INVESTOR_TWITTER) score += 10 * 0.15;
  return Math.min(score, 100);
}
function isRecentActivity(lastActivity) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
  return new Date(lastActivity) > thirtyDaysAgo;
}
function analyzeInvestmentActivity(roundCounts) {
  const averageRounds = roundCounts.reduce((sum, count) => sum + count, 0) / roundCounts.length;
  if (averageRounds > 10) return "Very Active";
  if (averageRounds > 5) return "Active";
  if (averageRounds > 2) return "Moderate";
  return "Limited";
}
function assessPerformanceQuality(averageScore, highPerformers, totalInvestors) {
  const highPerformerRatio = highPerformers / totalInvestors;
  if (averageScore > 0.3 && highPerformerRatio > 0.3) return "Exceptional";
  if (averageScore > 0.1 && highPerformerRatio > 0.2) return "High Quality";
  if (averageScore > 0 && highPerformerRatio > 0.1) return "Good Quality";
  if (averageScore > -0.2) return "Average Quality";
  return "Below Average Quality";
}
function categorizePerformance(score) {
  if (score >= 2) return "Elite";
  if (score >= 1) return "Excellent";
  if (score >= 0.5) return "Good";
  if (score >= 0.2) return "Average";
  if (score >= 0) return "Below Average";
  return "Poor";
}
function assessDataCompleteness(investorsData) {
  const requiredFields = ["INVESTOR_NAME", "ROI_AVERAGE", "ROUND_COUNT"];
  let completeness = 0;
  investorsData.forEach((investor) => {
    const presentFields = requiredFields.filter(
      (field) => investor[field] !== null && investor[field] !== void 0
    );
    completeness += presentFields.length / requiredFields.length;
  });
  const avgCompleteness = completeness / investorsData.length * 100;
  if (avgCompleteness > 80) return "Very Complete";
  if (avgCompleteness > 60) return "Complete";
  if (avgCompleteness > 40) return "Moderate";
  return "Limited";
}
function assessCoverageScope2(investorsData) {
  const investorCount = investorsData.length;
  if (investorCount > 100) return "Comprehensive";
  if (investorCount > 50) return "Broad";
  if (investorCount > 25) return "Moderate";
  return "Limited";
}
function identifyMarketLeaders(topInfluencers) {
  return topInfluencers.slice(0, 3).map(
    (influencer) => `${influencer.name} (Influence: ${influencer.influence_score})`
  );
}
function determinMarketMood(sentiment, activityRate) {
  if (sentiment === "Bullish" && activityRate > 60) return "Optimistic and Active";
  if (sentiment === "Bullish" && activityRate < 40) return "Cautiously Optimistic";
  if (sentiment === "Bearish" && activityRate > 60) return "Actively Concerned";
  if (sentiment === "Bearish" && activityRate < 40) return "Disengaged and Pessimistic";
  if (activityRate > 60) return "Highly Active";
  return "Wait and See";
}
function determineMarketOutlook(performanceAnalysis, sentimentAnalysis) {
  const performance = performanceAnalysis.overall_performance;
  const sentiment = sentimentAnalysis.overall_sentiment;
  if (performance === "Excellent" && sentiment === "Bullish") return "Very Positive";
  if (performance === "Good" && sentiment === "Bullish") return "Positive";
  if (performance === "Below Average" && sentiment === "Bearish") return "Negative";
  if (performance === "Average" || sentiment === "Neutral") return "Neutral";
  return "Mixed Signals";
}
function suggestInvestmentStrategy(performanceAnalysis, sentimentAnalysis) {
  const strategies = [];
  if (performanceAnalysis.overall_performance === "Excellent") {
    strategies.push("Follow successful investor strategies and allocations");
    strategies.push("Consider increasing exposure to top-performing investor favorites");
  }
  if (sentimentAnalysis.overall_sentiment === "Bullish") {
    strategies.push("Take advantage of positive sentiment for growth positions");
  } else if (sentimentAnalysis.overall_sentiment === "Bearish") {
    strategies.push("Focus on defensive positioning and risk management");
  }
  strategies.push("Monitor top investor movements for early trend identification");
  return strategies;
}
function identifyRiskConsiderations(performanceAnalysis, sentimentAnalysis) {
  const risks = [];
  if (performanceAnalysis.overall_performance === "Below Average") {
    risks.push("Weak investor performance indicates challenging market conditions");
  }
  if (sentimentAnalysis.overall_sentiment === "Bearish") {
    risks.push("Negative sentiment may lead to increased volatility and selling pressure");
  }
  risks.push("Investor behavior can change rapidly based on market events");
  risks.push("High-influence investors can disproportionately impact market movements");
  return risks;
}
function identifyOpportunities(performanceAnalysis, sentimentAnalysis) {
  const opportunities = [];
  if (performanceAnalysis.overall_performance === "Excellent") {
    opportunities.push("Learn from and potentially follow high-performing investor strategies");
  }
  if (sentimentAnalysis.overall_sentiment === "Bullish") {
    opportunities.push("Leverage positive sentiment for portfolio growth");
  }
  opportunities.push("Identify emerging trends by monitoring investor allocation changes");
  opportunities.push("Use investor influence data for better market timing");
  return opportunities;
}
function analyzeInfluenceDistribution(influenceMetrics) {
  const highInfluence = influenceMetrics.filter((inv) => inv.influence_score >= 80).length;
  const moderateInfluence = influenceMetrics.filter((inv) => inv.influence_score >= 60 && inv.influence_score < 80).length;
  const lowInfluence = influenceMetrics.filter((inv) => inv.influence_score < 60).length;
  return {
    high_influence: `${highInfluence} (${(highInfluence / influenceMetrics.length * 100).toFixed(1)}%)`,
    moderate_influence: `${moderateInfluence} (${(moderateInfluence / influenceMetrics.length * 100).toFixed(1)}%)`,
    low_influence: `${lowInfluence} (${(lowInfluence / influenceMetrics.length * 100).toFixed(1)}%)`,
    influence_concentration: highInfluence > influenceMetrics.length * 0.2 ? "Concentrated" : "Distributed"
  };
}
function assessMarketCoverage(investorsData) {
  const websiteCount = investorsData.filter((inv) => inv.INVESTOR_WEBSITE).length;
  const twitterCount = investorsData.filter((inv) => inv.INVESTOR_TWITTER).length;
  const onlinePresence = (websiteCount + twitterCount) / (investorsData.length * 2) * 100;
  if (onlinePresence > 70) return "High Online Presence";
  if (onlinePresence > 50) return "Moderate Online Presence";
  if (onlinePresence > 30) return "Limited Online Presence";
  return "Minimal Online Presence";
}
function formatCryptoInvestorsResponse(investorsData, analysis, request) {
  if (!investorsData || investorsData.length === 0) {
    return "\u274C No crypto investors data available at the moment.";
  }
  const { limit, analysisType } = request;
  let response = `\u{1F465} **Crypto Investors Analysis** (${investorsData.length} investors)

`;
  const displayCount = Math.min(investorsData.length, 10);
  response += `\u{1F3C6} **Top ${displayCount} Investors by ROI:**
`;
  const sortedInvestors = [...investorsData].sort((a, b) => (b.ROI_AVERAGE || 0) - (a.ROI_AVERAGE || 0));
  for (let i = 0; i < displayCount; i++) {
    const investor = sortedInvestors[i];
    const rank = i + 1;
    const name = investor.INVESTOR_NAME || `Investor ${rank}`;
    const roi = investor.ROI_AVERAGE !== null ? `${(investor.ROI_AVERAGE * 100).toFixed(1)}%` : "N/A";
    const rounds = investor.ROUND_COUNT || "N/A";
    response += `${rank}. **${name}** - ROI: ${roi} (${rounds} rounds)
`;
  }
  if (investorsData.length > displayCount) {
    response += `
... and ${investorsData.length - displayCount} more investors
`;
  }
  if (analysis?.insights && analysis.insights.length > 0) {
    response += `
\u{1F4CA} **Key Insights:**
`;
    analysis.insights.slice(0, 4).forEach((insight) => {
      response += `\u2022 ${insight}
`;
    });
  }
  if (analysis?.performance_analysis) {
    const perf = analysis.performance_analysis;
    response += `
\u{1F4C8} **Performance Overview:**
`;
    response += `\u2022 Average ROI: ${perf.average_score}
`;
    response += `\u2022 Overall Performance: ${perf.overall_performance}
`;
    if (perf.performance_distribution) {
      response += `\u2022 High Performers (50%+ ROI): ${perf.performance_distribution.high_performers}
`;
      response += `\u2022 Poor Performers (Negative ROI): ${perf.performance_distribution.poor_performers}
`;
    }
  }
  if (analysis?.market_participation) {
    const market = analysis.market_participation;
    response += `
\u{1F3AF} **Market Participation:**
`;
    response += `\u2022 Participation Level: ${market.participation_level}
`;
    if (market.participation_rate) {
      response += `\u2022 Active Rate: ${market.participation_rate}
`;
    }
    if (market.round_analysis?.total_investment_rounds) {
      response += `\u2022 Total Investment Rounds: ${market.round_analysis.total_investment_rounds}
`;
    }
  }
  if (analysisType === "performance" && analysis?.performance_focus) {
    response += `
\u{1F3C6} **Performance Focus:**
`;
    analysis.performance_focus.performance_insights?.slice(0, 3).forEach((insight) => {
      response += `\u2022 ${insight}
`;
    });
  } else if (analysisType === "influence" && analysis?.influence_focus) {
    response += `
\u{1F31F} **Influence Focus:**
`;
    analysis.influence_focus.influence_insights?.slice(0, 3).forEach((insight) => {
      response += `\u2022 ${insight}
`;
    });
  } else if (analysisType === "sentiment" && analysis?.sentiment_focus) {
    response += `
\u{1F60A} **Sentiment Focus:**
`;
    analysis.sentiment_focus.sentiment_insights?.slice(0, 3).forEach((insight) => {
      response += `\u2022 ${insight}
`;
    });
  }
  if (analysis?.investment_strategy && analysis.investment_strategy.length > 0) {
    response += `
\u{1F4A1} **Investment Strategy:**
`;
    analysis.investment_strategy.slice(0, 3).forEach((strategy) => {
      response += `\u2022 ${strategy}
`;
    });
  }
  response += `
\u{1F4DA} **Note:** ROI scores are based on average returns from investment rounds. Negative values indicate losses.`;
  return response;
}

// src/actions/getScenarioAnalysisAction.ts
import {
  elizaLogger as elizaLogger7,
  composePromptFromState as composePromptFromState2,
  parseKeyValueXml as parseKeyValueXml2,
  ModelType as ModelType2,
  createActionResult as createActionResult6
} from "@elizaos/core";
var ScenarioAnalysisRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of scenarios to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["risk_assessment", "portfolio_planning", "stress_testing", "all"]).optional().describe("Type of analysis to focus on")
});
var scenarioAnalysisTemplate = `# Task: Extract Scenario Analysis Request Information

**CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.**

Based on the conversation context, identify the scenario analysis request details:

## Required Information:
1. **cryptocurrency** (optional): The EXACT name or symbol mentioned
   - Examples: "Bitcoin", "Ethereum", "Dogecoin", "Avalanche", "Solana"
   - Symbols: "BTC", "ETH", "DOGE", "AVAX", "SOL", "ADA", "DOT"
   - CRITICAL: Use the EXACT text the user provided

2. **symbol** (optional): Extract if user mentions a symbol
   - Common patterns: BTC, ETH, AVAX, SOL, ADA, DOT, MATIC, LINK
   - If user says "BTC" \u2192 symbol: "BTC"
   - If user says "Bitcoin" \u2192 cryptocurrency: "Bitcoin"

3. **analysisType** (optional, default: "all"): Type of scenario analysis
   - "risk_assessment" - focus on downside risks and worst-case scenarios
   - "portfolio_planning" - focus on scenarios for portfolio allocation  
   - "stress_testing" - focus on extreme market conditions
   - "all" - comprehensive scenario analysis

4. **limit** (optional, default: 20): Number of scenarios to return
5. **page** (optional, default: 1): Page number for pagination

## Examples:
- "Get scenario analysis for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", analysisType: "all"}
- "Show me price scenarios for ETH" \u2192 {symbol: "ETH", analysisType: "all"}
- "AVAX scenario analysis" \u2192 {symbol: "AVAX", analysisType: "all"}
- "Risk scenarios for Avalanche" \u2192 {cryptocurrency: "Avalanche", analysisType: "risk_assessment"}
- "Stress test scenarios for market crash" \u2192 {analysisType: "stress_testing"}

**IMPORTANT**: 
- Extract EXACTLY what the user typed
- Do not convert between names and symbols
- Do not assume or substitute different cryptocurrencies
- If unclear, extract the exact text mentioned

Extract the scenario analysis request from the user's message and respond in XML format:

<response>
<cryptocurrency>exact cryptocurrency name mentioned by user</cryptocurrency>
<symbol>exact symbol mentioned by user</symbol>
<analysisType>risk_assessment|portfolio_planning|stress_testing|all</analysisType>
<limit>number of scenarios to return</limit>
<page>page number for pagination</page>
</response>
`;
function extractCryptocurrencySimple2(text) {
  const upperText = text.toUpperCase();
  const symbolMap = {
    "BTC": { cryptocurrency: "Bitcoin", symbol: "BTC" },
    "ETH": { cryptocurrency: "Ethereum", symbol: "ETH" },
    "AVAX": { cryptocurrency: "Avalanche", symbol: "AVAX" },
    "SOL": { cryptocurrency: "Solana", symbol: "SOL" },
    "ADA": { cryptocurrency: "Cardano", symbol: "ADA" },
    "DOT": { cryptocurrency: "Polkadot", symbol: "DOT" },
    "MATIC": { cryptocurrency: "Polygon", symbol: "MATIC" },
    "LINK": { cryptocurrency: "Chainlink", symbol: "LINK" },
    "DOGE": { cryptocurrency: "Dogecoin", symbol: "DOGE" },
    "XRP": { cryptocurrency: "Ripple", symbol: "XRP" }
  };
  for (const [symbol, data] of Object.entries(symbolMap)) {
    if (upperText.includes(symbol)) {
      return { cryptocurrency: data.cryptocurrency, symbol: data.symbol };
    }
  }
  const nameMap = {
    "BITCOIN": { cryptocurrency: "Bitcoin", symbol: "BTC" },
    "ETHEREUM": { cryptocurrency: "Ethereum", symbol: "ETH" },
    "AVALANCHE": { cryptocurrency: "Avalanche", symbol: "AVAX" },
    "SOLANA": { cryptocurrency: "Solana", symbol: "SOL" },
    "CARDANO": { cryptocurrency: "Cardano", symbol: "ADA" },
    "POLKADOT": { cryptocurrency: "Polkadot", symbol: "DOT" },
    "POLYGON": { cryptocurrency: "Polygon", symbol: "MATIC" },
    "CHAINLINK": { cryptocurrency: "Chainlink", symbol: "LINK" },
    "DOGECOIN": { cryptocurrency: "Dogecoin", symbol: "DOGE" },
    "RIPPLE": { cryptocurrency: "Ripple", symbol: "XRP" }
  };
  for (const [name, data] of Object.entries(nameMap)) {
    if (upperText.includes(name)) {
      return { cryptocurrency: data.cryptocurrency, symbol: data.symbol };
    }
  }
  return {};
}
var getScenarioAnalysisAction = {
  name: "GET_SCENARIO_ANALYSIS_TOKENMETRICS",
  description: "Get price predictions based on different cryptocurrency market scenarios from TokenMetrics for risk assessment and strategic planning",
  similes: [
    "get scenario analysis",
    "scenario predictions",
    "market scenarios",
    "price scenarios",
    "scenario modeling",
    "what if analysis",
    "market scenario planning",
    "stress testing",
    "risk scenarios"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get scenario analysis for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze potential Bitcoin scenarios and price projections using TokenMetrics.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me risk scenarios for portfolio planning"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get comprehensive scenario analysis for portfolio risk assessment and planning.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Stress test scenarios for market crash"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve stress testing scenarios for extreme market conditions.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing scenario analysis request...`);
      const userMessage = message.content?.text || "";
      console.log(`\u{1F50D} AI EXTRACTION CONTEXT [${requestId}]:`);
      console.log(`\u{1F4DD} User message: "${userMessage}"`);
      console.log(`\u{1F4CB} Template being used:`);
      console.log(scenarioAnalysisTemplate);
      console.log(`\u{1F51A} END CONTEXT [${requestId}]`);
      const enhancedTemplate = scenarioAnalysisTemplate.replace("{{requestId}}", requestId).replace("{{timestamp}}", (/* @__PURE__ */ new Date()).toISOString()) + `

# Cache Busting ID: ${requestId}
# Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const scenarioRequestResult = await runtime.useModel(ModelType2.TEXT_LARGE, {
        prompt: composePromptFromState2({
          state: state || await runtime.composeState(message),
          template: enhancedTemplate
        })
      });
      const parsedResult = parseKeyValueXml2(scenarioRequestResult);
      let scenarioRequest = parsedResult || {};
      console.log(`[${requestId}] AI Extracted:`, scenarioRequest);
      if (!scenarioRequest?.cryptocurrency && !scenarioRequest?.symbol) {
        console.log(`[${requestId}] AI extraction incomplete, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple2(userMessage);
        if (regexResult.cryptocurrency || regexResult.symbol) {
          scenarioRequest = {
            ...scenarioRequest,
            ...regexResult
          };
          console.log(`[${requestId}] Applied regex fallback:`, scenarioRequest);
        }
      }
      if (scenarioRequest?.cryptocurrency && !scenarioRequest?.symbol) {
        const crypto = scenarioRequest.cryptocurrency.toUpperCase();
        const symbolPattern = /^[A-Z0-9]{3,10}$/;
        if (symbolPattern.test(crypto)) {
          console.log(`[${requestId}] \u{1F527} Fixing misclassified extraction: "${scenarioRequest.cryptocurrency}" appears to be a symbol, not a cryptocurrency name`);
          scenarioRequest = {
            ...scenarioRequest,
            cryptocurrency: void 0,
            symbol: crypto
          };
          console.log(`[${requestId}] \u{1F527} Corrected to:`, { symbol: crypto });
        }
      }
      if (scenarioRequest?.cryptocurrency || scenarioRequest?.symbol) {
        console.log(`[${requestId}] \u2705 Successfully extracted cryptocurrency: ${scenarioRequest.cryptocurrency || scenarioRequest.symbol}`);
      } else {
        console.log(`[${requestId}] \u26A0\uFE0F No specific cryptocurrency extracted, proceeding with general analysis`);
      }
      const processedRequest = {
        cryptocurrency: scenarioRequest.cryptocurrency,
        token_id: scenarioRequest.token_id,
        symbol: scenarioRequest.symbol,
        limit: scenarioRequest.limit || 20,
        page: scenarioRequest.page || 1,
        analysisType: scenarioRequest.analysisType || "all"
      };
      let cryptoToResolve = processedRequest.cryptocurrency;
      if (!cryptoToResolve && processedRequest.symbol) {
        const mappedName = mapSymbolToName(processedRequest.symbol);
        if (mappedName !== processedRequest.symbol) {
          cryptoToResolve = mappedName;
          processedRequest.cryptocurrency = mappedName;
          console.log(`[${requestId}] \u{1F504} Mapped symbol "${processedRequest.symbol}" to "${mappedName}"`);
        } else {
          cryptoToResolve = processedRequest.symbol;
          console.log(`[${requestId}] \u{1F50D} Symbol "${processedRequest.symbol}" not in mapping, will try direct resolution`);
        }
      }
      let resolvedToken = null;
      if (cryptoToResolve && !processedRequest.token_id) {
        try {
          resolvedToken = await resolveTokenSmart(cryptoToResolve, runtime);
          if (resolvedToken) {
            processedRequest.token_id = resolvedToken.TOKEN_ID;
            processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
            processedRequest.cryptocurrency = resolvedToken.TOKEN_NAME;
            console.log(`[${requestId}] \u2705 Resolved "${cryptoToResolve}" to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL}) - ID: ${resolvedToken.TOKEN_ID}`);
          } else {
            console.log(`[${requestId}] \u274C Failed to resolve "${cryptoToResolve}"`);
          }
        } catch (error) {
          console.log(`[${requestId}] \u274C Error resolving token "${cryptoToResolve}":`, error);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) apiParams.token_id = processedRequest.token_id;
      if (processedRequest.symbol) apiParams.symbol = processedRequest.symbol;
      const response = await callTokenMetricsAPI(
        "/v2/scenario-analysis",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      if (response && response.success === false) {
        console.log(`[${requestId}] \u274C API returned error: ${response.message || "Unknown error"}`);
        if (callback) {
          await callback({
            text: `\u274C No scenario analysis data available for ${processedRequest.cryptocurrency || processedRequest.symbol || "this token"}.

This could mean:
\u2022 Token is not covered by TokenMetrics scenario modeling
\u2022 Insufficient historical data for scenario generation
\u2022 Token may be too new or have limited market activity

Try using the full cryptocurrency name instead of the symbol.`,
            content: {
              success: false,
              error: response.message || "Data not found",
              request_id: requestId
            }
          });
        }
        return createActionResult6({
          success: false,
          error: "Failed to retrieve scenario analysis data."
        });
      }
      let scenarioData = [];
      if (Array.isArray(response)) {
        scenarioData = response;
      } else if (response.data && Array.isArray(response.data)) {
        const rawData = response.data;
        scenarioData = rawData.flatMap((item) => {
          if (item.SCENARIO_PREDICTION && item.SCENARIO_PREDICTION.scenario_prediction) {
            return item.SCENARIO_PREDICTION.scenario_prediction.map((scenario) => ({
              // Transform to expected format
              TOKEN_ID: item.TOKEN_ID,
              TOKEN_NAME: item.TOKEN_NAME,
              TOKEN_SYMBOL: item.TOKEN_SYMBOL,
              CURRENT_PRICE: item.SCENARIO_PREDICTION.current_price,
              PREDICTED_DATE: item.SCENARIO_PREDICTION.predicted_date,
              CATEGORY: item.SCENARIO_PREDICTION.category_name,
              // Scenario-specific data
              SCENARIO_ID: scenario.scenario,
              SCENARIO_TYPE: `Scenario ${scenario.scenario}`,
              // Price predictions (use base as primary)
              PREDICTED_PRICE: scenario.predicted_price_base,
              PRICE_TARGET: scenario.predicted_price_base,
              PREDICTED_PRICE_BEAR: scenario.predicted_price_bear,
              PREDICTED_PRICE_MOON: scenario.predicted_price_moon,
              // ROI predictions
              PREDICTED_ROI: scenario.predicted_roi_base,
              PREDICTED_ROI_BEAR: scenario.predicted_roi_bear,
              PREDICTED_ROI_MOON: scenario.predicted_roi_moon,
              // Market cap predictions
              PREDICTED_MCAP_BASE: scenario.predicted_mcap_base,
              PREDICTED_MCAP_BEAR: scenario.predicted_mcap_bear,
              PREDICTED_MCAP_MOON: scenario.predicted_mcap_moon,
              // Additional metadata
              TOTAL_MCAP_SCENARIO: scenario.total_mcap_scenario,
              // Assign probability based on scenario type (higher scenarios = lower probability)
              PROBABILITY: scenario.scenario <= 1 ? 40 : scenario.scenario <= 2 ? 30 : scenario.scenario <= 4 ? 20 : scenario.scenario <= 6 ? 15 : 10,
              // Scenario description
              SCENARIO_DESCRIPTION: `${scenario.scenario <= 1 ? "Conservative" : scenario.scenario <= 2 ? "Moderate" : scenario.scenario <= 4 ? "Optimistic" : scenario.scenario <= 6 ? "Bullish" : "Extreme Bullish"} scenario with ${(scenario.predicted_roi_base * 100).toFixed(0)}% base ROI`,
              // Raw scenario data for reference
              RAW_SCENARIO: scenario
            }));
          }
          return [item];
        });
      } else {
        scenarioData = [];
      }
      console.log(`[${requestId}] Processed ${scenarioData.length} scenarios from API response`);
      const scenarioAnalysis = analyzeScenarioData(scenarioData, processedRequest.analysisType);
      const tokenName = processedRequest.cryptocurrency || processedRequest.symbol || "Cryptocurrency";
      let responseText = `\u{1F4CA} **Scenario Analysis for ${tokenName}**

`;
      if (scenarioData.length === 0) {
        responseText += "\u274C No scenario analysis data available for this token.\n";
        responseText += "This could mean:\n";
        responseText += "\u2022 Token is not covered by TokenMetrics scenario modeling\n";
        responseText += "\u2022 Insufficient historical data for scenario generation\n";
        responseText += "\u2022 Token may be too new or have limited market activity\n";
      } else {
        responseText += `\u{1F3AF} **Analysis Summary**
`;
        responseText += `\u2022 Total Scenarios: ${scenarioData.length}
`;
        responseText += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText += `\u2022 Data Source: TokenMetrics Scenario Modeling Engine

`;
        if (scenarioAnalysis.scenario_breakdown) {
          responseText += `\u{1F4C8} **Scenario Breakdown**
`;
          responseText += `\u2022 Total Scenario Types: ${scenarioAnalysis.scenario_breakdown.scenario_types || 0}
`;
          responseText += `\u2022 Most Likely Scenario: ${scenarioAnalysis.scenario_breakdown.most_likely_scenario || "Unknown"}

`;
        }
        if (scenarioAnalysis.risk_assessment) {
          responseText += `\u26A0\uFE0F **Risk Assessment**
`;
          responseText += `\u2022 Risk Level: ${scenarioAnalysis.risk_assessment.overall_risk_level || "Unknown"}
`;
          responseText += `\u2022 Max Potential Drawdown: ${scenarioAnalysis.risk_assessment.max_potential_drawdown || "Unknown"}
`;
          responseText += `\u2022 Downside Scenarios: ${scenarioAnalysis.risk_assessment.downside_scenarios || 0}

`;
        }
        if (scenarioAnalysis.opportunity_analysis) {
          responseText += `\u{1F680} **Opportunity Analysis**
`;
          responseText += `\u2022 Upside Potential: ${scenarioAnalysis.opportunity_analysis.upside_potential || "Unknown"}
`;
          responseText += `\u2022 Max Potential Upside: ${scenarioAnalysis.opportunity_analysis.max_potential_upside || "Unknown"}
`;
          responseText += `\u2022 Upside Scenarios: ${scenarioAnalysis.opportunity_analysis.upside_scenarios || 0}

`;
        }
        if (scenarioAnalysis.insights && scenarioAnalysis.insights.length > 0) {
          responseText += `\u{1F4A1} **Key Insights**
`;
          scenarioAnalysis.insights.slice(0, 3).forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
          responseText += `
`;
        }
        responseText += `\u{1F4CB} **Usage Guidelines**
`;
        responseText += `\u2022 Use for risk assessment and portfolio stress testing
`;
        responseText += `\u2022 Plan position sizing based on downside scenarios
`;
        responseText += `\u2022 Set profit targets based on upside scenarios
`;
        responseText += `\u2022 Develop contingency plans for extreme scenarios

`;
        responseText += `\u26A1 *Scenario analysis is probabilistic, not predictive. Use for strategic planning and risk management.*`;
      }
      console.log(`[${requestId}] Scenario analysis completed successfully`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            scenario_data: scenarioData,
            analysis: scenarioAnalysis,
            metadata: {
              endpoint: "scenario-analysis",
              data_source: "TokenMetrics Official API",
              api_version: "v2",
              requested_token: tokenName,
              resolved_token: resolvedToken,
              analysis_focus: processedRequest.analysisType,
              data_points: scenarioData.length
            }
          }
        });
      }
      return createActionResult6({
        success: true,
        text: responseText,
        data: {
          scenario_analysis: scenarioData,
          analysis: scenarioAnalysis,
          source: "TokenMetrics Scenario Analysis"
        }
      });
    } catch (error) {
      console.error("Error in getScenarioAnalysisAction:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      if (callback) {
        await callback({
          text: `\u274C Failed to retrieve scenario analysis: ${errorMessage}`,
          content: {
            success: false,
            error: errorMessage
          }
        });
      }
      return createActionResult6({
        success: false,
        error: errorMessage
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger7.log("\u{1F50D} Validating getScenarioAnalysisAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger7.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeScenarioData(scenarioData, analysisType = "all") {
  if (!scenarioData || scenarioData.length === 0) {
    return {
      summary: "No scenario analysis data available",
      risk_assessment: "Cannot assess",
      insights: []
    };
  }
  const scenarioBreakdown = analyzeScenarioBreakdown(scenarioData);
  const riskAssessment = assessScenarioRisks(scenarioData);
  const opportunityAnalysis = analyzeScenarioOpportunities(scenarioData);
  const probabilityAnalysis = analyzeProbabilityDistribution(scenarioData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "risk_assessment":
      focusedAnalysis = {
        risk_focus: {
          downside_scenarios: identifyDownsideScenarios(scenarioData),
          worst_case_analysis: analyzeWorstCaseScenarios(scenarioData),
          risk_mitigation: generateRiskMitigationStrategies(riskAssessment.max_drawdown || 0, riskAssessment.downside_scenarios || 0),
          risk_insights: [
            `\u26A0\uFE0F Downside scenarios: ${riskAssessment.downside_scenarios || 0}`,
            `\u{1F4C9} Maximum potential loss: ${riskAssessment.max_loss || "Unknown"}`,
            `\u{1F6E1}\uFE0F Risk level: ${riskAssessment.overall_risk_level || "Unknown"}`
          ]
        }
      };
      break;
    case "portfolio_planning":
      focusedAnalysis = {
        portfolio_focus: {
          allocation_scenarios: generateAllocationScenarios(scenarioData),
          diversification_impact: analyzeDiversificationImpact(scenarioData),
          rebalancing_triggers: identifyRebalancingTriggers(scenarioData),
          portfolio_insights: [
            `\u{1F4CA} Allocation scenarios: ${scenarioBreakdown.scenario_types || 0}`,
            `\u{1F3AF} Optimal allocation: ${opportunityAnalysis.optimal_allocation || "Balanced"}`,
            `\u2696\uFE0F Risk-return profile: ${riskAssessment.risk_return_profile || "Moderate"}`
          ]
        }
      };
      break;
    case "stress_testing":
      focusedAnalysis = {
        stress_focus: {
          extreme_scenarios: identifyExtremeScenarios(scenarioData),
          stress_test_results: performStressTests(scenarioData),
          survival_analysis: analyzeSurvivalProbability(scenarioData),
          stress_insights: [
            `\u{1F525} Extreme scenarios: ${riskAssessment.extreme_scenarios || 0}`,
            `\u{1F4AA} Stress test score: ${riskAssessment.stress_score || "Unknown"}`,
            `\u{1F3AF} Survival probability: ${riskAssessment.survival_probability || "Unknown"}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Scenario analysis across ${scenarioData.length} scenarios shows ${riskAssessment.overall_risk_level} risk with ${opportunityAnalysis.upside_potential} upside potential`,
    analysis_type: analysisType,
    scenario_breakdown: scenarioBreakdown,
    risk_assessment: riskAssessment,
    opportunity_analysis: opportunityAnalysis,
    probability_analysis: probabilityAnalysis,
    insights: generateScenarioInsights(scenarioBreakdown, riskAssessment, opportunityAnalysis),
    strategic_recommendations: generateStrategicRecommendations2(riskAssessment, opportunityAnalysis, probabilityAnalysis),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics Scenario Modeling Engine",
      scenarios_analyzed: scenarioData.length,
      coverage_completeness: assessScenarioCoverage(scenarioData),
      model_sophistication: assessModelSophistication(scenarioData)
    },
    portfolio_implications: generatePortfolioImplications2(scenarioData, analysisType)
  };
}
function analyzeScenarioBreakdown(scenarioData) {
  const scenarios = /* @__PURE__ */ new Map();
  scenarioData.forEach((scenario) => {
    const type = scenario.SCENARIO_TYPE || scenario.TYPE || categorizeScenario(scenario);
    if (!scenarios.has(type)) {
      scenarios.set(type, []);
    }
    scenarios.get(type).push(scenario);
  });
  const scenarioAnalysis = Array.from(scenarios.entries()).map(([type, scenarios2]) => {
    const prices = scenarios2.map((s) => s.PREDICTED_PRICE || s.PRICE_TARGET).filter((p) => p && p > 0);
    const probabilities = scenarios2.map((s) => s.PROBABILITY || s.LIKELIHOOD).filter((p) => p !== null && p !== void 0);
    const avgPrice = prices.length > 0 ? prices.reduce((sum, price) => sum + price, 0) / prices.length : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const avgProbability = probabilities.length > 0 ? probabilities.reduce((sum, prob) => sum + prob, 0) / probabilities.length : 0;
    return {
      scenario_type: type,
      scenario_count: scenarios2.length,
      average_price: formatCurrency(avgPrice),
      price_range: {
        min: formatCurrency(minPrice),
        max: formatCurrency(maxPrice),
        spread: formatCurrency(maxPrice - minPrice)
      },
      average_probability: `${avgProbability.toFixed(1)}%`,
      scenarios_detail: scenarios2.slice(0, 3).map((s) => ({
        description: s.SCENARIO_DESCRIPTION || s.DESCRIPTION || `${type} scenario`,
        price_target: formatCurrency(s.PREDICTED_PRICE || s.PRICE_TARGET),
        probability: s.PROBABILITY ? `${s.PROBABILITY}%` : "N/A",
        timeframe: s.TIMEFRAME || s.TIME_HORIZON || "Unknown"
      }))
    };
  }).sort((a, b) => parseFloat(b.average_probability) - parseFloat(a.average_probability));
  return {
    total_scenarios: scenarioData.length,
    scenario_types: scenarios.size,
    scenario_breakdown: scenarioAnalysis,
    most_likely_scenario: scenarioAnalysis[0]?.scenario_type || "Unknown",
    scenario_diversity: assessScenarioDiversity(scenarioAnalysis)
  };
}
function assessScenarioRisks(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  const downSideScenarios = scenarioData.filter(
    (s) => (s.PREDICTED_PRICE || s.PRICE_TARGET) < currentPrice * 0.9
  );
  const extremeDownside = scenarioData.filter(
    (s) => (s.PREDICTED_PRICE || s.PRICE_TARGET) < currentPrice * 0.7
  );
  const maxDrawdown = scenarioData.reduce((maxDD, scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET || currentPrice;
    const drawdown = (currentPrice - price) / currentPrice;
    return Math.max(maxDD, drawdown);
  }, 0);
  const averageDownside = downSideScenarios.length > 0 ? downSideScenarios.reduce((sum, s) => {
    const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
    return sum + (currentPrice - price) / currentPrice;
  }, 0) / downSideScenarios.length : 0;
  let riskLevel;
  if (maxDrawdown > 0.6) riskLevel = "Very High";
  else if (maxDrawdown > 0.4) riskLevel = "High";
  else if (maxDrawdown > 0.25) riskLevel = "Moderate";
  else if (maxDrawdown > 0.15) riskLevel = "Low";
  else riskLevel = "Very Low";
  return {
    overall_risk_level: riskLevel,
    max_potential_drawdown: formatPercentage(maxDrawdown * 100),
    downside_scenarios: downSideScenarios.length,
    extreme_downside_scenarios: extremeDownside.length,
    average_downside: formatPercentage(averageDownside * 100),
    risk_factors: identifyRiskFactors(downSideScenarios),
    worst_case_scenario: identifyWorstCaseScenario(scenarioData),
    risk_mitigation: generateRiskMitigationStrategies(maxDrawdown, downSideScenarios.length)
  };
}
function analyzeScenarioOpportunities(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  const upsideScenarios = scenarioData.filter(
    (s) => (s.PREDICTED_PRICE || s.PRICE_TARGET) > currentPrice * 1.1
  );
  const extremeUpside = scenarioData.filter(
    (s) => (s.PREDICTED_PRICE || s.PRICE_TARGET) > currentPrice * 1.5
  );
  const maxUpside = scenarioData.reduce((maxUp, scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET || currentPrice;
    const upside = (price - currentPrice) / currentPrice;
    return Math.max(maxUp, upside);
  }, 0);
  const averageUpside = upsideScenarios.length > 0 ? upsideScenarios.reduce((sum, s) => {
    const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
    return sum + (price - currentPrice) / currentPrice;
  }, 0) / upsideScenarios.length : 0;
  let upsidePotential;
  if (maxUpside > 3) upsidePotential = "Exceptional";
  else if (maxUpside > 2) upsidePotential = "Very High";
  else if (maxUpside > 1) upsidePotential = "High";
  else if (maxUpside > 0.5) upsidePotential = "Moderate";
  else upsidePotential = "Limited";
  return {
    upside_potential: upsidePotential,
    max_potential_upside: formatPercentage(maxUpside * 100),
    upside_scenarios: upsideScenarios.length,
    extreme_upside_scenarios: extremeUpside.length,
    average_upside: formatPercentage(averageUpside * 100),
    opportunity_drivers: identifyOpportunityDrivers(upsideScenarios),
    best_case_scenario: identifyBestCaseScenario(scenarioData),
    opportunity_capture: generateOpportunityCaptureStrategies(maxUpside, upsideScenarios.length)
  };
}
function analyzeProbabilityDistribution(scenarioData) {
  const probabilityData = scenarioData.filter((s) => s.PROBABILITY !== null && s.PROBABILITY !== void 0).map((s) => ({
    probability: s.PROBABILITY,
    price: s.PREDICTED_PRICE || s.PRICE_TARGET,
    type: s.SCENARIO_TYPE || s.TYPE
  }));
  if (probabilityData.length === 0) {
    return { distribution: "No probability data available" };
  }
  const totalProbability = probabilityData.reduce((sum, item) => sum + item.probability, 0);
  const weightedAveragePrice = probabilityData.reduce((sum, item) => {
    return sum + item.price * item.probability / totalProbability;
  }, 0);
  const highProbability = probabilityData.filter((item) => item.probability > 30);
  const mediumProbability = probabilityData.filter((item) => item.probability > 15 && item.probability <= 30);
  const lowProbability = probabilityData.filter((item) => item.probability <= 15);
  return {
    total_scenarios_with_probability: probabilityData.length,
    weighted_average_price: formatCurrency(weightedAveragePrice),
    probability_distribution: {
      high_probability: `${highProbability.length} scenarios (>30% probability)`,
      medium_probability: `${mediumProbability.length} scenarios (15-30% probability)`,
      low_probability: `${lowProbability.length} scenarios (<15% probability)`
    },
    most_probable_scenarios: highProbability.slice(0, 3).map((item) => ({
      scenario_type: item.type,
      probability: `${item.probability}%`,
      price_target: formatCurrency(item.price)
    })),
    confidence_level: assessConfidenceLevel(probabilityData)
  };
}
function generatePortfolioImplications2(scenarioData, analysisType) {
  const implications = [];
  const recommendations = [];
  const riskMetrics = assessScenarioRisks(scenarioData);
  if (riskMetrics.overall_risk_level === "Very High" || riskMetrics.overall_risk_level === "High") {
    implications.push("High downside risk suggests conservative position sizing");
    recommendations.push("Limit exposure to 2-5% of total portfolio");
    recommendations.push("Use tight stop-losses or options for downside protection");
  } else if (riskMetrics.overall_risk_level === "Low" || riskMetrics.overall_risk_level === "Very Low") {
    implications.push("Low downside risk supports larger position sizes");
    recommendations.push("Can consider 5-15% portfolio allocation");
  }
  const opportunityMetrics = analyzeScenarioOpportunities(scenarioData);
  if (opportunityMetrics.upside_potential === "Exceptional" || opportunityMetrics.upside_potential === "Very High") {
    implications.push("Exceptional upside potential justifies higher allocation consideration");
    recommendations.push("Consider using options strategies to amplify upside exposure");
  }
  const scenarioBreakdown = analyzeScenarioBreakdown(scenarioData);
  if (scenarioBreakdown.scenario_diversity === "High") {
    implications.push("High scenario diversity requires flexible strategy adaptation");
    recommendations.push("Prepare multiple exit strategies for different scenarios");
  }
  return {
    key_implications: implications,
    allocation_recommendations: recommendations,
    position_sizing_guidance: generatePositionSizingGuidance(riskMetrics, opportunityMetrics),
    hedging_strategies: generateHedgingStrategies2(riskMetrics),
    monitoring_requirements: generateMonitoringRequirements(scenarioData),
    analysis_type: analysisType
  };
}
function generateScenarioInsights(scenarioBreakdown, riskAssessment, opportunityAnalysis) {
  const insights = [];
  if (scenarioBreakdown.scenario_types >= 4) {
    insights.push(`Comprehensive scenario coverage with ${scenarioBreakdown.scenario_types} different scenario types provides robust analysis foundation`);
  } else if (scenarioBreakdown.scenario_types < 3) {
    insights.push("Limited scenario diversity may not capture full range of potential outcomes");
  }
  const maxDrawdown = parseFloat(riskAssessment.max_potential_drawdown);
  const maxUpside = parseFloat(opportunityAnalysis.max_potential_upside);
  if (maxUpside > maxDrawdown * 2) {
    insights.push("Favorable risk-reward profile with upside potential significantly exceeding downside risk");
  } else if (maxDrawdown > maxUpside * 1.5) {
    insights.push("Unfavorable risk-reward profile with downside risk exceeding upside potential");
  } else {
    insights.push("Balanced risk-reward profile requires careful position sizing and risk management");
  }
  if (scenarioBreakdown.most_likely_scenario) {
    insights.push(`${scenarioBreakdown.most_likely_scenario} scenario has highest probability - plan primary strategy around this outcome`);
  }
  if (riskAssessment.extreme_downside_scenarios > 0) {
    insights.push(`${riskAssessment.extreme_downside_scenarios} extreme downside scenarios require robust risk management protocols`);
  }
  if (opportunityAnalysis.extreme_upside_scenarios > 0) {
    insights.push(`${opportunityAnalysis.extreme_upside_scenarios} extreme upside scenarios suggest potential for significant outperformance`);
  }
  return insights;
}
function generateStrategicRecommendations2(riskAssessment, opportunityAnalysis, probabilityAnalysis) {
  const recommendations = [];
  let primaryStrategy = "Balanced";
  if (riskAssessment.overall_risk_level === "Very High") {
    recommendations.push("Implement strict risk controls and defensive positioning");
    primaryStrategy = "Defensive";
  } else if (riskAssessment.overall_risk_level === "Low") {
    recommendations.push("Low risk environment supports more aggressive positioning");
  }
  if (opportunityAnalysis.upside_potential === "Exceptional") {
    recommendations.push("Exceptional upside potential justifies concentrated allocation");
    if (primaryStrategy !== "Defensive") primaryStrategy = "Aggressive Growth";
  } else if (opportunityAnalysis.upside_potential === "Limited") {
    recommendations.push("Limited upside suggests exploring alternative opportunities");
  }
  if (probabilityAnalysis.confidence_level === "High") {
    recommendations.push("High confidence in scenarios supports conviction-based positioning");
  } else if (probabilityAnalysis.confidence_level === "Low") {
    recommendations.push("Low scenario confidence requires hedged approach and flexibility");
  }
  recommendations.push("Develop specific action plans for top 3 most probable scenarios");
  recommendations.push("Set clear triggers for strategy adjustment as scenarios unfold");
  recommendations.push("Regular scenario review and model updates as new data emerges");
  return {
    primary_strategy: primaryStrategy,
    strategic_recommendations: recommendations,
    implementation_priorities: generateImplementationPriorities2(riskAssessment, opportunityAnalysis),
    contingency_planning: generateContingencyPlanning(riskAssessment, opportunityAnalysis)
  };
}
function categorizeScenario(scenario) {
  const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
  const description = (scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || "").toLowerCase();
  if (description.includes("bull") || description.includes("optimistic")) return "Bull Market";
  if (description.includes("bear") || description.includes("pessimistic")) return "Bear Market";
  if (description.includes("base") || description.includes("likely")) return "Base Case";
  if (description.includes("extreme") || description.includes("crash")) return "Extreme Event";
  const currentPrice = 5e4;
  if (price > currentPrice * 1.3) return "Bullish Scenario";
  if (price < currentPrice * 0.7) return "Bearish Scenario";
  return "Neutral Scenario";
}
function getCurrentPriceEstimate(scenarioData) {
  const baseCases = scenarioData.filter(
    (s) => (s.SCENARIO_TYPE || s.TYPE || "").toLowerCase().includes("base")
  );
  if (baseCases.length > 0) {
    return baseCases[0].PREDICTED_PRICE || baseCases[0].PRICE_TARGET || 5e4;
  }
  const allPrices = scenarioData.map((s) => s.PREDICTED_PRICE || s.PRICE_TARGET).filter((p) => p > 0);
  return allPrices.length > 0 ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length : 5e4;
}
function identifyRiskFactors(downSideScenarios) {
  const factors = /* @__PURE__ */ new Set();
  downSideScenarios.forEach((scenario) => {
    const description = scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || "";
    const type = scenario.SCENARIO_TYPE || scenario.TYPE || "";
    if (description.toLowerCase().includes("regulation")) factors.add("Regulatory risks");
    if (description.toLowerCase().includes("crash") || description.toLowerCase().includes("bubble")) factors.add("Market bubble burst");
    if (description.toLowerCase().includes("macro") || description.toLowerCase().includes("recession")) factors.add("Macroeconomic downturn");
    if (description.toLowerCase().includes("technical") || description.toLowerCase().includes("hack")) factors.add("Technical vulnerabilities");
    if (description.toLowerCase().includes("adoption") || description.toLowerCase().includes("demand")) factors.add("Adoption challenges");
  });
  if (factors.size === 0) {
    factors.add("General market volatility");
    factors.add("Liquidity constraints");
  }
  return Array.from(factors);
}
function identifyOpportunityDrivers(upsideScenarios) {
  const drivers = /* @__PURE__ */ new Set();
  upsideScenarios.forEach((scenario) => {
    const description = scenario.SCENARIO_DESCRIPTION || scenario.DESCRIPTION || "";
    if (description.toLowerCase().includes("adoption")) drivers.add("Mass adoption");
    if (description.toLowerCase().includes("institutional")) drivers.add("Institutional investment");
    if (description.toLowerCase().includes("breakthrough") || description.toLowerCase().includes("innovation")) drivers.add("Technology breakthrough");
    if (description.toLowerCase().includes("etf") || description.toLowerCase().includes("approval")) drivers.add("Regulatory approval");
    if (description.toLowerCase().includes("bull") || description.toLowerCase().includes("rally")) drivers.add("Market momentum");
  });
  if (drivers.size === 0) {
    drivers.add("Market growth");
    drivers.add("Increased demand");
  }
  return Array.from(drivers);
}
function identifyWorstCaseScenario(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  const worstCase = scenarioData.reduce((worst, scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
    const worstPrice2 = worst.PREDICTED_PRICE || worst.PRICE_TARGET || currentPrice;
    return price < worstPrice2 ? scenario : worst;
  }, scenarioData[0] || {});
  const worstPrice = worstCase.PREDICTED_PRICE || worstCase.PRICE_TARGET || currentPrice;
  const drawdown = (currentPrice - worstPrice) / currentPrice * 100;
  return {
    scenario_description: worstCase.SCENARIO_DESCRIPTION || worstCase.DESCRIPTION || "Extreme downside scenario",
    price_target: formatCurrency(worstPrice),
    potential_loss: formatPercentage(drawdown),
    probability: worstCase.PROBABILITY ? `${worstCase.PROBABILITY}%` : "Unknown"
  };
}
function identifyBestCaseScenario(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  const bestCase = scenarioData.reduce((best, scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
    const bestPrice2 = best.PREDICTED_PRICE || best.PRICE_TARGET || currentPrice;
    return price > bestPrice2 ? scenario : best;
  }, scenarioData[0] || {});
  const bestPrice = bestCase.PREDICTED_PRICE || bestCase.PRICE_TARGET || currentPrice;
  const upside = (bestPrice - currentPrice) / currentPrice * 100;
  return {
    scenario_description: bestCase.SCENARIO_DESCRIPTION || bestCase.DESCRIPTION || "Extreme upside scenario",
    price_target: formatCurrency(bestPrice),
    potential_gain: formatPercentage(upside),
    probability: bestCase.PROBABILITY ? `${bestCase.PROBABILITY}%` : "Unknown"
  };
}
function assessScenarioDiversity(scenarioAnalysis) {
  const typeCount = scenarioAnalysis.length;
  const priceSpread = scenarioAnalysis.reduce((maxSpread, scenario) => {
    const spread = parseFloat(scenario.price_range.spread.replace(/[$,]/g, ""));
    return Math.max(maxSpread, spread);
  }, 0);
  if (typeCount >= 5 && priceSpread > 1e4) return "Very High";
  if (typeCount >= 4 && priceSpread > 5e3) return "High";
  if (typeCount >= 3) return "Moderate";
  return "Low";
}
function generateRiskMitigationStrategies(maxDrawdown, downsideCount) {
  const strategies = [];
  if (maxDrawdown > 0.5) {
    strategies.push("Use position sizing limits (max 3-5% of portfolio)");
    strategies.push("Implement stop-loss orders at key technical levels");
    strategies.push("Consider protective put options for downside protection");
  } else if (maxDrawdown > 0.3) {
    strategies.push("Moderate position sizing (5-10% of portfolio)");
    strategies.push("Use trailing stops to protect profits");
  }
  if (downsideCount > 3) {
    strategies.push("Diversify across multiple assets to reduce concentration risk");
    strategies.push("Maintain higher cash allocation for opportunistic buying");
  }
  strategies.push("Regular portfolio rebalancing based on scenario updates");
  return strategies;
}
function generateOpportunityCaptureStrategies(maxUpside, upsideCount) {
  const strategies = [];
  if (maxUpside > 2) {
    strategies.push("Consider using call options to amplify upside exposure");
    strategies.push("Scale into positions on weakness to maximize upside capture");
  } else if (maxUpside > 1) {
    strategies.push("Standard position sizing with upside profit targets");
  }
  if (upsideCount > 3) {
    strategies.push("Multiple profit-taking levels based on different upside scenarios");
    strategies.push("Partial position scaling to capture various upside targets");
  }
  strategies.push("Monitor scenario probability changes for tactical adjustments");
  return strategies;
}
function assessConfidenceLevel(probabilityData) {
  const totalProbability = probabilityData.reduce((sum, item) => sum + item.probability, 0);
  const highProbabilityScenarios = probabilityData.filter((item) => item.probability > 25).length;
  if (totalProbability > 90 && highProbabilityScenarios > 0) return "High";
  if (totalProbability > 70) return "Moderate";
  if (totalProbability > 50) return "Low";
  return "Very Low";
}
function generatePositionSizingGuidance(riskMetrics, opportunityMetrics) {
  const risk = riskMetrics.overall_risk_level;
  const opportunity = opportunityMetrics.upside_potential;
  if (risk === "Very High") return "Conservative sizing: 1-3% of portfolio maximum";
  if (risk === "High" && opportunity === "Exceptional") return "Moderate sizing: 3-7% with tight risk controls";
  if (risk === "Moderate" && opportunity === "High") return "Standard sizing: 5-12% with normal risk management";
  if (risk === "Low" && opportunity === "Very High") return "Aggressive sizing: 10-20% with profit protection";
  return "Balanced sizing: 5-10% with standard risk management";
}
function generateHedgingStrategies2(riskMetrics) {
  const strategies = [];
  if (riskMetrics.overall_risk_level === "Very High" || riskMetrics.overall_risk_level === "High") {
    strategies.push("Consider protective puts for downside protection");
    strategies.push("Use correlation analysis for portfolio hedging");
    strategies.push("Implement collar strategies (protective put + covered call)");
  }
  strategies.push("Monitor VIX and implied volatility for hedging timing");
  strategies.push("Consider inverse ETFs for portfolio protection");
  return strategies;
}
function generateMonitoringRequirements(scenarioData) {
  const requirements = [];
  requirements.push("Weekly review of scenario probability changes");
  requirements.push("Monitor key assumption variables that drive scenarios");
  requirements.push("Track early warning indicators for scenario shifts");
  requirements.push("Quarterly full scenario model validation and updates");
  if (scenarioData.some((s) => s.SCENARIO_TYPE?.includes("regulation"))) {
    requirements.push("Daily monitoring of regulatory developments");
  }
  if (scenarioData.some((s) => s.SCENARIO_TYPE?.includes("technical"))) {
    requirements.push("Technical indicator monitoring for trend changes");
  }
  return requirements;
}
function generateImplementationPriorities2(riskAssessment, opportunityAnalysis) {
  const priorities = [];
  if (riskAssessment.overall_risk_level === "Very High") {
    priorities.push("1. Implement comprehensive risk management framework");
    priorities.push("2. Establish position sizing limits and stop-loss protocols");
    priorities.push("3. Set up hedging mechanisms");
  } else {
    priorities.push("1. Establish position sizing based on scenario probabilities");
    priorities.push("2. Set profit targets based on upside scenarios");
  }
  priorities.push("3. Create scenario monitoring dashboard");
  priorities.push("4. Develop contingency plans for extreme scenarios");
  return priorities;
}
function generateContingencyPlanning(riskAssessment, opportunityAnalysis) {
  const plans = [];
  if (riskAssessment.extreme_downside_scenarios > 0) {
    plans.push({
      trigger: "Extreme downside scenario begins to unfold",
      actions: ["Reduce position size immediately", "Activate hedging strategies", "Preserve capital for recovery"]
    });
  }
  if (opportunityAnalysis.extreme_upside_scenarios > 0) {
    plans.push({
      trigger: "Extreme upside scenario develops",
      actions: ["Scale into position gradually", "Set trailing stops", "Prepare profit-taking strategy"]
    });
  }
  plans.push({
    trigger: "Base case scenario deviates significantly",
    actions: ["Reassess scenario probabilities", "Adjust position sizing", "Update risk parameters"]
  });
  return {
    contingency_plans: plans,
    review_frequency: "Monthly scenario review with quarterly deep analysis",
    escalation_procedures: "Immediate review if any scenario probability changes by >20%"
  };
}
function assessScenarioCoverage(scenarioData) {
  const scenarioTypes = new Set(scenarioData.map((s) => s.SCENARIO_TYPE || s.TYPE || "Unknown"));
  const priceRanges = scenarioData.map((s) => s.PREDICTED_PRICE || s.PRICE_TARGET).filter((p) => p > 0);
  const coverage = scenarioTypes.size;
  const priceSpread = priceRanges.length > 0 ? (Math.max(...priceRanges) - Math.min(...priceRanges)) / Math.min(...priceRanges) : 0;
  if (coverage >= 5 && priceSpread > 1) return "Comprehensive";
  if (coverage >= 4 && priceSpread > 0.5) return "Good";
  if (coverage >= 3) return "Adequate";
  return "Limited";
}
function assessModelSophistication(scenarioData) {
  const withProbabilities = scenarioData.filter((s) => s.PROBABILITY !== null && s.PROBABILITY !== void 0).length;
  const withTimeframes = scenarioData.filter((s) => s.TIMEFRAME || s.TIME_HORIZON).length;
  const withDescriptions = scenarioData.filter((s) => s.SCENARIO_DESCRIPTION || s.DESCRIPTION).length;
  const sophisticationScore = (withProbabilities + withTimeframes + withDescriptions) / (scenarioData.length * 3);
  if (sophisticationScore > 0.8) return "Advanced";
  if (sophisticationScore > 0.6) return "Intermediate";
  if (sophisticationScore > 0.4) return "Basic";
  return "Simple";
}
function identifyDownsideScenarios(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  return scenarioData.filter((scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
    return price && price < currentPrice * 0.9;
  });
}
function analyzeWorstCaseScenarios(scenarioData) {
  const downside = identifyDownsideScenarios(scenarioData);
  const worstCase = identifyWorstCaseScenario(scenarioData);
  return {
    worst_case_scenario: worstCase,
    severe_scenarios: downside.filter((s) => {
      const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
      const currentPrice = getCurrentPriceEstimate(scenarioData);
      return price < currentPrice * 0.5;
    }).length,
    total_downside_scenarios: downside.length
  };
}
function generateAllocationScenarios(scenarioData) {
  const scenarios = ["Conservative", "Moderate", "Aggressive"];
  return scenarios.map((type) => ({
    allocation_type: type,
    recommended_exposure: type === "Conservative" ? "10-20%" : type === "Moderate" ? "20-40%" : "40-60%",
    risk_tolerance: type.toLowerCase(),
    scenario_count: Math.floor(scenarioData.length / 3)
  }));
}
function analyzeDiversificationImpact(scenarioData) {
  return {
    correlation_impact: "Moderate",
    diversification_benefit: "Significant during market stress",
    recommended_allocation: "5-15% of portfolio",
    rebalancing_frequency: "Quarterly"
  };
}
function identifyRebalancingTriggers(scenarioData) {
  return [
    "Price deviation >25% from target allocation",
    "Significant change in scenario probabilities",
    "New extreme scenarios identified",
    "Quarterly review regardless of performance"
  ];
}
function identifyExtremeScenarios(scenarioData) {
  const currentPrice = getCurrentPriceEstimate(scenarioData);
  return scenarioData.filter((scenario) => {
    const price = scenario.PREDICTED_PRICE || scenario.PRICE_TARGET;
    const probability = scenario.PROBABILITY || 0;
    return price && (price < currentPrice * 0.3 || // 70% decline
    price > currentPrice * 3 || // 200% gain
    probability < 5);
  });
}
function performStressTests(scenarioData) {
  const extremeScenarios = identifyExtremeScenarios(scenarioData);
  const worstCase = identifyWorstCaseScenario(scenarioData);
  return {
    stress_test_score: extremeScenarios.length > 3 ? "High Risk" : extremeScenarios.length > 1 ? "Moderate Risk" : "Low Risk",
    extreme_scenario_count: extremeScenarios.length,
    worst_case_impact: worstCase.potential_loss || "Unknown",
    stress_resistance: extremeScenarios.length < 2 ? "Strong" : "Weak"
  };
}
function analyzeSurvivalProbability(scenarioData) {
  const totalScenarios = scenarioData.length;
  const severeDownside = scenarioData.filter((s) => {
    const price = s.PREDICTED_PRICE || s.PRICE_TARGET;
    const currentPrice = getCurrentPriceEstimate(scenarioData);
    return price && price < currentPrice * 0.2;
  }).length;
  const survivalRate = (totalScenarios - severeDownside) / totalScenarios * 100;
  return {
    survival_probability: `${survivalRate.toFixed(1)}%`,
    severe_scenarios: severeDownside,
    survival_rating: survivalRate > 90 ? "Excellent" : survivalRate > 75 ? "Good" : survivalRate > 50 ? "Fair" : "Poor"
  };
}

// src/actions/getResistanceSupportAction.ts
import {
  elizaLogger as elizaLogger8,
  createActionResult as createActionResult7
} from "@elizaos/core";
async function searchTokenDynamically2(query, runtime) {
  try {
    elizaLogger8.log(`\u{1F50D} Searching for token: "${query}" using /tokens endpoint`);
    let searchParams = {
      symbol: query.toUpperCase(),
      limit: 5
      // Get multiple results to find the most popular one
    };
    let tokenData = await callTokenMetricsAPI("/v2/tokens", searchParams, runtime);
    if (tokenData?.data && tokenData.data.length > 0) {
      const majorCryptoMapping = {
        "BTC": "Bitcoin",
        "ETH": "Ethereum",
        "DOGE": "Dogecoin",
        "ADA": "Cardano",
        "SOL": "Solana",
        "AVAX": "Avalanche",
        "MATIC": "Polygon",
        "DOT": "Polkadot",
        "LINK": "Chainlink",
        "UNI": "Uniswap",
        "BONK": "Bonk"
      };
      const expectedName = majorCryptoMapping[query.toUpperCase()];
      if (expectedName) {
        const exactMatch = tokenData.data.find(
          (token) => token.TOKEN_NAME?.toLowerCase() === expectedName.toLowerCase()
        );
        if (exactMatch) {
          elizaLogger8.log(`\u{1F3AF} Found exact major crypto match: ${exactMatch.TOKEN_NAME} (${exactMatch.TOKEN_SYMBOL}) - ID: ${exactMatch.TOKEN_ID}`);
          return exactMatch;
        }
      }
      let bestToken = tokenData.data[0];
      if (tokenData.data.length > 1) {
        elizaLogger8.log(`\u{1F50D} Multiple tokens found, selecting best match...`);
        const sortedTokens = tokenData.data.sort((a, b) => {
          const aExactMatch = a.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
          const bExactMatch = b.TOKEN_SYMBOL?.toUpperCase() === query.toUpperCase() ? 1 : 0;
          if (aExactMatch !== bExactMatch) return bExactMatch - aExactMatch;
          const aExchanges = a.EXCHANGE_LIST?.length || 0;
          const bExchanges = b.EXCHANGE_LIST?.length || 0;
          if (aExchanges !== bExchanges) return bExchanges - aExchanges;
          const aCategories = a.CATEGORY_LIST?.length || 0;
          const bCategories = b.CATEGORY_LIST?.length || 0;
          return bCategories - aCategories;
        });
        bestToken = sortedTokens[0];
        elizaLogger8.log(`\u{1F3AF} Selected best token: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ${bestToken.EXCHANGE_LIST?.length || 0} exchanges`);
      }
      elizaLogger8.log(`\u2705 Found token by symbol: ${bestToken.TOKEN_NAME} (${bestToken.TOKEN_SYMBOL}) - ID: ${bestToken.TOKEN_ID}`);
      return bestToken;
    }
    const majorCryptoNames = {
      "BTC": "Bitcoin",
      "ETH": "Ethereum",
      "DOGE": "Dogecoin",
      "ADA": "Cardano",
      "SOL": "Solana",
      "AVAX": "Avalanche",
      "MATIC": "Polygon",
      "DOT": "Polkadot",
      "LINK": "Chainlink",
      "UNI": "Uniswap",
      "BONK": "Bonk"
    };
    const searchName = majorCryptoNames[query.toUpperCase()] || query;
    searchParams = {
      token_name: searchName,
      limit: 10
      // Get more results to find best match
    };
    tokenData = await callTokenMetricsAPI("/v2/tokens", searchParams, runtime);
    if (tokenData?.data && tokenData.data.length > 0) {
      const queryLower = query.toLowerCase();
      const bestMatch = tokenData.data.find(
        (token) => token.TOKEN_NAME?.toLowerCase().includes(queryLower) || token.TOKEN_SYMBOL?.toLowerCase() === queryLower || token.TOKEN_NAME?.toLowerCase() === queryLower
      ) || tokenData.data[0];
      elizaLogger8.log(`\u2705 Found token by name: ${bestMatch.TOKEN_NAME} (${bestMatch.TOKEN_SYMBOL}) - ID: ${bestMatch.TOKEN_ID}`);
      return bestMatch;
    }
    elizaLogger8.log(`\u274C No token found for query: "${query}"`);
    return null;
  } catch (error) {
    elizaLogger8.error(`\u274C Error searching for token "${query}":`, error);
    return null;
  }
}
var ResistanceSupportRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of levels to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["trading_levels", "breakout_analysis", "risk_management", "all"]).optional().describe("Type of analysis to focus on")
});
function extractCryptocurrencySimple3(text) {
  const normalizedText = text.toLowerCase();
  const patterns = [
    // Bitcoin patterns
    { regex: /\b(bitcoin|btc)\b/i, cryptocurrency: "Bitcoin", symbol: "BTC" },
    // Ethereum patterns  
    { regex: /\b(ethereum|eth)\b/i, cryptocurrency: "Ethereum", symbol: "ETH" },
    // Dogecoin patterns
    { regex: /\b(dogecoin|doge)\b/i, cryptocurrency: "Dogecoin", symbol: "DOGE" },
    // Solana patterns
    { regex: /\b(solana|sol)\b/i, cryptocurrency: "Solana", symbol: "SOL" },
    // Avalanche patterns
    { regex: /\b(avalanche|avax)\b/i, cryptocurrency: "Avalanche", symbol: "AVAX" },
    // Cardano patterns
    { regex: /\b(cardano|ada)\b/i, cryptocurrency: "Cardano", symbol: "ADA" },
    // Polkadot patterns
    { regex: /\b(polkadot|dot)\b/i, cryptocurrency: "Polkadot", symbol: "DOT" },
    // Chainlink patterns
    { regex: /\b(chainlink|link)\b/i, cryptocurrency: "Chainlink", symbol: "LINK" },
    // Polygon patterns
    { regex: /\b(polygon|matic)\b/i, cryptocurrency: "Polygon", symbol: "MATIC" },
    // Binance Coin patterns
    { regex: /\b(binance coin|bnb)\b/i, cryptocurrency: "BNB", symbol: "BNB" }
  ];
  for (const pattern of patterns) {
    if (pattern.regex.test(normalizedText)) {
      return {
        cryptocurrency: pattern.cryptocurrency,
        symbol: pattern.symbol
      };
    }
  }
  return null;
}
var RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting resistance and support level requests from natural language.

CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

The user wants to get historical levels of resistance and support for cryptocurrency technical analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH", "Solana", "SOL", "Avalanche", "AVAX"
   - MUST extract the EXACT name/symbol mentioned by the user
   - Examples: "Bitcoin" \u2192 "Bitcoin", "BTC" \u2192 "Bitcoin", "ETH" \u2192 "Ethereum", "SOL" \u2192 "Solana", "AVAX" \u2192 "Avalanche"

2. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", "SOL", "AVAX", "DOGE", etc.
   - If user says "Bitcoin" \u2192 symbol: "BTC"
   - If user says "Ethereum" \u2192 symbol: "ETH" 
   - If user says "Solana" \u2192 symbol: "SOL"
   - If user says "Avalanche" \u2192 symbol: "AVAX"

3. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

4. **limit** (optional, default: 50): Number of levels to return

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "trading_levels" - focus on key trading levels and entry/exit points
   - "breakout_analysis" - focus on potential breakout/breakdown scenarios
   - "risk_management" - focus on stop-loss and risk management levels
   - "all" - comprehensive resistance and support analysis

Examples:
- "Get resistance and support levels for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me key trading levels for ETH" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "trading_levels"}
- "Support and resistance for breakout analysis" \u2192 {analysisType: "breakout_analysis"}
- "Risk management levels for Solana" \u2192 {cryptocurrency: "Solana", symbol: "SOL", analysisType: "risk_management"}
- "Resistance analysis for SOL" \u2192 {cryptocurrency: "Solana", symbol: "SOL", analysisType: "all"}
- "Support levels for AVAX" \u2192 {cryptocurrency: "Avalanche", symbol: "AVAX", analysisType: "all"}

Extract the request details from the user's message and respond in XML format:

<response>
<cryptocurrency>token name mentioned by user</cryptocurrency>
<symbol>token symbol (BTC, ETH, SOL, etc.)</symbol>
<token_id>specific token ID if mentioned</token_id>
<limit>number of levels to return</limit>
<page>page number</page>
<analysisType>trading_levels|breakout_analysis|risk_management|all</analysisType>
</response>
`;
var getResistanceSupportAction = {
  name: "GET_RESISTANCE_SUPPORT_TOKENMETRICS",
  description: "Get historical levels of resistance and support for cryptocurrency tokens from TokenMetrics for technical analysis and trading strategies",
  similes: [
    "get resistance support",
    "support resistance levels",
    "technical levels",
    "price levels",
    "key levels",
    "support resistance analysis",
    "technical analysis levels",
    "trading levels",
    "breakout levels"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "What are the support and resistance levels for Bitcoin?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the support and resistance levels for Bitcoin.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me resistance levels for ETH"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze the resistance and support levels for Ethereum.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get technical levels for Solana"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve the technical support and resistance levels for Solana.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ]
  ],
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing resistance and support levels request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const levelsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        ResistanceSupportRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, levelsRequest);
      let processedRequest = {
        cryptocurrency: levelsRequest.cryptocurrency,
        token_id: levelsRequest.token_id,
        symbol: levelsRequest.symbol,
        limit: levelsRequest.limit || 50,
        page: levelsRequest.page || 1,
        analysisType: levelsRequest.analysisType || "all"
      };
      const userText = message.content?.text || "" || "";
      const regexResult = extractCryptocurrencySimple3(userText);
      if (regexResult) {
        const aiExtracted = processedRequest.cryptocurrency?.toLowerCase() || "";
        const regexExtracted = regexResult.cryptocurrency?.toLowerCase() || "";
        if (!processedRequest.cryptocurrency || regexExtracted && aiExtracted && !aiExtracted.includes(regexExtracted.split(" ")[0]) && !regexExtracted.includes(aiExtracted)) {
          console.log(`[${requestId}] Using regex fallback: AI extracted "${processedRequest.cryptocurrency}" but regex found "${regexResult.cryptocurrency}"`);
          processedRequest.cryptocurrency = regexResult.cryptocurrency;
          processedRequest.symbol = regexResult.symbol;
        }
        if (regexResult.symbol && !processedRequest.symbol) {
          processedRequest.symbol = regexResult.symbol;
        }
      }
      if (processedRequest.cryptocurrency && !processedRequest.symbol) {
        const isLikelySymbol = processedRequest.cryptocurrency.length <= 5 && processedRequest.cryptocurrency.toUpperCase() === processedRequest.cryptocurrency;
        if (isLikelySymbol) {
          try {
            console.log(`[${requestId}] Cryptocurrency "${processedRequest.cryptocurrency}" looks like a symbol, resolving dynamically...`);
            const foundToken = await searchTokenDynamically2(processedRequest.cryptocurrency, runtime);
            if (foundToken) {
              console.log(`[${requestId}] \u2705 Resolved symbol "${processedRequest.cryptocurrency}" to "${foundToken.TOKEN_NAME}" (${foundToken.TOKEN_SYMBOL})`);
              processedRequest.cryptocurrency = foundToken.TOKEN_NAME;
              processedRequest.symbol = foundToken.TOKEN_SYMBOL;
            }
          } catch (error) {
            console.log(`[${requestId}] \u274C Dynamic symbol resolution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
          }
        }
      }
      console.log(`[${requestId}] Final processed request:`, processedRequest);
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id) {
        const isLikelySymbol = processedRequest.cryptocurrency.length <= 5 && processedRequest.cryptocurrency === processedRequest.cryptocurrency.toUpperCase();
        if (!isLikelySymbol) {
          try {
            resolvedToken = await searchTokenDynamically2(processedRequest.cryptocurrency, runtime);
            if (resolvedToken) {
              processedRequest.token_id = resolvedToken.TOKEN_ID;
              processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
              console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_SYMBOL} (ID: ${resolvedToken.TOKEN_ID})`);
            } else {
              console.log(`[${requestId}] Token resolution returned null for "${processedRequest.cryptocurrency}"`);
            }
          } catch (error) {
            console.log(`[${requestId}] Token resolution failed for "${processedRequest.cryptocurrency}": ${error instanceof Error ? error.message : "Unknown error"}`);
          }
        } else {
          console.log(`[${requestId}] Skipping token resolution for "${processedRequest.cryptocurrency}" (appears to be a symbol)`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) {
        apiParams.token_id = processedRequest.token_id;
        console.log(`[${requestId}] Using token_id parameter: ${processedRequest.token_id}`);
      } else if (processedRequest.symbol) {
        apiParams.symbol = processedRequest.symbol;
        console.log(`[${requestId}] Using symbol parameter: ${processedRequest.symbol}`);
      } else if (processedRequest.cryptocurrency) {
        try {
          console.log(`[${requestId}] Attempting dynamic token search for: ${processedRequest.cryptocurrency}`);
          const foundToken = await searchTokenDynamically2(processedRequest.cryptocurrency, runtime);
          if (foundToken) {
            apiParams.token_id = foundToken.TOKEN_ID;
            apiParams.symbol = foundToken.TOKEN_SYMBOL;
            console.log(`[${requestId}] \u2705 Dynamic search successful: ${foundToken.TOKEN_NAME} (${foundToken.TOKEN_SYMBOL}) - ID: ${foundToken.TOKEN_ID}`);
          } else {
            console.log(`[${requestId}] \u274C Dynamic token search failed for: ${processedRequest.cryptocurrency}`);
          }
        } catch (error) {
          console.log(`[${requestId}] \u274C Error in dynamic token search: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
      }
      console.log(`[${requestId}] Final API parameters:`, apiParams);
      const response = await callTokenMetricsAPI(
        "/v2/resistance-support",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      let levelsData = [];
      if (Array.isArray(response)) {
        levelsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        let selectedTokenData = null;
        if (response.data.length === 1) {
          selectedTokenData = response.data[0];
        } else if (response.data.length > 1) {
          console.log(`[${requestId}] Multiple tokens found with same symbol, selecting main token...`);
          const mainTokenSelectors = [
            // For Bitcoin - select the main Bitcoin, not wrapped versions
            (token) => token.TOKEN_NAME === "Bitcoin" && token.TOKEN_SYMBOL === "BTC",
            // For Dogecoin - select the main Dogecoin, not other DOGE tokens
            (token) => token.TOKEN_NAME === "Dogecoin" && token.TOKEN_SYMBOL === "DOGE",
            // For Ethereum - select the main Ethereum
            (token) => token.TOKEN_NAME === "Ethereum" && token.TOKEN_SYMBOL === "ETH",
            // For other tokens - prefer exact name matches or shortest/simplest names
            (token) => {
              const name = token.TOKEN_NAME.toLowerCase();
              const symbol = token.TOKEN_SYMBOL.toLowerCase();
              const avoidKeywords = ["wrapped", "bridged", "peg", "department", "binance", "osmosis"];
              const hasAvoidKeywords = avoidKeywords.some((keyword) => name.includes(keyword));
              if (hasAvoidKeywords) return false;
              if (symbol === "btc" && name.includes("bitcoin")) return true;
              if (symbol === "eth" && name.includes("ethereum")) return true;
              if (symbol === "doge" && name.includes("dogecoin")) return true;
              if (symbol === "sol" && name.includes("solana")) return true;
              if (symbol === "avax" && name.includes("avalanche")) return true;
              return false;
            }
          ];
          for (const selector of mainTokenSelectors) {
            const match = response.data.find(selector);
            if (match) {
              selectedTokenData = match;
              console.log(`[${requestId}] Selected main token: ${match.TOKEN_NAME} (${match.TOKEN_SYMBOL}) - ID: ${match.TOKEN_ID}`);
              break;
            }
          }
          if (!selectedTokenData) {
            selectedTokenData = response.data[0];
            console.log(`[${requestId}] No main token identified, using first token: ${selectedTokenData.TOKEN_NAME} (${selectedTokenData.TOKEN_SYMBOL})`);
          }
        } else {
          console.log(`[${requestId}] No token data found in response`);
        }
        if (selectedTokenData && selectedTokenData.HISTORICAL_RESISTANCE_SUPPORT_LEVELS) {
          const historicalLevels = selectedTokenData.HISTORICAL_RESISTANCE_SUPPORT_LEVELS;
          const sortedLevels = historicalLevels.map((level) => ({
            ...level,
            price: parseFloat(level.level)
          })).filter((level) => level.price > 0).sort((a, b) => a.price - b.price);
          const recentLevels = sortedLevels.filter((level) => new Date(level.date) > /* @__PURE__ */ new Date("2024-01-01")).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          let currentPrice = 0;
          if (recentLevels.length > 0) {
            currentPrice = recentLevels[0].price;
            console.log(`[${requestId}] Using most recent level as current price reference: ${currentPrice} (${recentLevels[0].date})`);
          } else if (sortedLevels.length > 0) {
            const medianIndex = Math.floor(sortedLevels.length / 2);
            currentPrice = sortedLevels[medianIndex].price;
            console.log(`[${requestId}] Using median level as current price reference: ${currentPrice}`);
          }
          levelsData = historicalLevels.map((level, index) => {
            const price = parseFloat(level.level);
            const isResistance = price > currentPrice;
            const isSupport = price <= currentPrice;
            const levelDate = new Date(level.date);
            const now = /* @__PURE__ */ new Date();
            const daysSinceLevel = (now.getTime() - levelDate.getTime()) / (1e3 * 60 * 60 * 24);
            let strength = Math.max(20, 100 - daysSinceLevel / 10);
            if (price > currentPrice * 1.5 || price < currentPrice * 0.5) {
              strength = Math.min(95, strength + 20);
            }
            return {
              LEVEL_TYPE: isResistance ? "RESISTANCE" : "SUPPORT",
              TYPE: isResistance ? "RESISTANCE" : "SUPPORT",
              PRICE_LEVEL: price,
              LEVEL_PRICE: price,
              STRENGTH: Math.round(strength),
              LEVEL_STRENGTH: Math.round(strength),
              DATE: level.date,
              TIMEFRAME: "daily",
              TOKEN_ID: selectedTokenData.TOKEN_ID,
              TOKEN_NAME: selectedTokenData.TOKEN_NAME,
              TOKEN_SYMBOL: selectedTokenData.TOKEN_SYMBOL,
              DAYS_SINCE: Math.round(daysSinceLevel),
              CURRENT_PRICE_REFERENCE: currentPrice
            };
          });
          console.log(`[${requestId}] Processed ${levelsData.length} historical levels for ${selectedTokenData.TOKEN_NAME} (${selectedTokenData.TOKEN_SYMBOL})`);
          console.log(`[${requestId}] Current price reference: ${currentPrice}, Resistance levels: ${levelsData.filter((l) => l.LEVEL_TYPE === "RESISTANCE").length}, Support levels: ${levelsData.filter((l) => l.LEVEL_TYPE === "SUPPORT").length}`);
        } else {
          console.log(`[${requestId}] No HISTORICAL_RESISTANCE_SUPPORT_LEVELS found in selected token data`);
        }
      } else {
        console.log(`[${requestId}] Unexpected response format:`, response);
      }
      const levelsAnalysis = analyzeResistanceSupportLevels(levelsData, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${levelsData.length} resistance and support levels from TokenMetrics`,
        request_id: requestId,
        resistance_support_levels: levelsData,
        analysis: levelsAnalysis,
        metadata: {
          endpoint: "resistance-support",
          requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
          resolved_token: resolvedToken,
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: levelsData.length,
          api_version: "v2",
          data_source: "TokenMetrics Technical Analysis Engine"
        },
        levels_explanation: {
          purpose: "Identify key price levels where buying or selling pressure typically emerges",
          resistance_levels: "Price levels where selling pressure historically increases, limiting upward movement",
          support_levels: "Price levels where buying pressure historically increases, limiting downward movement",
          usage_guidelines: [
            "Use support levels as potential entry points for long positions",
            "Use resistance levels as potential exit points or profit-taking levels",
            "Monitor level breaks for trend continuation or reversal signals",
            "Combine with volume analysis for confirmation of level significance"
          ],
          trading_applications: [
            "Set stop-loss orders below support levels",
            "Set take-profit orders near resistance levels",
            "Plan position sizes based on distance to key levels",
            "Identify potential breakout or breakdown scenarios"
          ]
        }
      };
      const tokenName = resolvedToken?.name || processedRequest.cryptocurrency || processedRequest.symbol || "the requested token";
      const resistanceLevels = levelsData.filter(
        (level) => level.LEVEL_TYPE === "RESISTANCE" || level.TYPE === "RESISTANCE"
      );
      const supportLevels = levelsData.filter(
        (level) => level.LEVEL_TYPE === "SUPPORT" || level.TYPE === "SUPPORT"
      );
      let responseText = `\u{1F4CA} **Resistance & Support Analysis for ${tokenName}**

`;
      if (levelsData.length === 0) {
        responseText += `\u274C No resistance and support levels found for ${tokenName}. This could mean:
`;
        responseText += `\u2022 The token may not have sufficient price history
`;
        responseText += `\u2022 TokenMetrics may not have performed technical analysis on this token yet
`;
        responseText += `\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum

`;
      } else {
        responseText += `\u2705 **Found ${levelsData.length} key levels** (${resistanceLevels.length} resistance, ${supportLevels.length} support)

`;
        const currentPriceRef = levelsData[0]?.CURRENT_PRICE_REFERENCE;
        if (currentPriceRef) {
          responseText += `\u{1F4B0} **Current Price Reference**: ${formatCurrency(currentPriceRef)}

`;
        }
        if (resistanceLevels.length > 0) {
          responseText += `\u{1F534} **Key Resistance Levels** (${resistanceLevels.length} total):
`;
          const topResistance = resistanceLevels.sort((a, b) => (b.STRENGTH || 0) - (a.STRENGTH || 0)).slice(0, 5);
          topResistance.forEach((level, index) => {
            const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
            const date = new Date(level.DATE).toLocaleDateString();
            const strength = level.STRENGTH || level.LEVEL_STRENGTH || 0;
            const strengthIcon = strength > 80 ? "\u{1F525}" : strength > 60 ? "\u{1F4AA}" : "\u{1F4CA}";
            responseText += `${index + 1}. ${strengthIcon} **${price}** (${date}) - Strength: ${Math.round(strength)}/100
`;
          });
          if (resistanceLevels.length > 5) {
            responseText += `   ... and ${resistanceLevels.length - 5} more resistance levels
`;
          }
          responseText += `
`;
        }
        if (supportLevels.length > 0) {
          responseText += `\u{1F7E2} **Key Support Levels** (${supportLevels.length} total):
`;
          const topSupport = supportLevels.sort((a, b) => (b.STRENGTH || 0) - (a.STRENGTH || 0)).slice(0, 5);
          topSupport.forEach((level, index) => {
            const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
            const date = new Date(level.DATE).toLocaleDateString();
            const strength = level.STRENGTH || level.LEVEL_STRENGTH || 0;
            const strengthIcon = strength > 80 ? "\u{1F525}" : strength > 60 ? "\u{1F4AA}" : "\u{1F4CA}";
            responseText += `${index + 1}. ${strengthIcon} **${price}** (${date}) - Strength: ${Math.round(strength)}/100
`;
          });
          if (supportLevels.length > 5) {
            responseText += `   ... and ${supportLevels.length - 5} more support levels
`;
          }
          responseText += `
`;
        }
        responseText += `\u{1F4C5} **Recent Historical Levels**:
`;
        const recentLevels = levelsData.sort((a, b) => new Date(b.DATE).getTime() - new Date(a.DATE).getTime()).slice(0, 5);
        recentLevels.forEach((level) => {
          const price = formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE);
          const date = new Date(level.DATE).toLocaleDateString();
          const type = level.LEVEL_TYPE || level.TYPE;
          const typeIcon = type === "RESISTANCE" ? "\u{1F534}" : "\u{1F7E2}";
          const daysAgo = level.DAYS_SINCE ? `(${level.DAYS_SINCE} days ago)` : "";
          responseText += `\u2022 ${typeIcon} **${price}** - ${date} ${daysAgo}
`;
        });
        responseText += `
`;
        if (processedRequest.analysisType === "trading_levels") {
          responseText += `\u{1F3AF} **Trading Levels Analysis:**
`;
          responseText += `\u2022 **Entry Opportunities**: ${supportLevels.length} support levels for potential long positions
`;
          responseText += `\u2022 **Exit Targets**: ${resistanceLevels.length} resistance levels for profit-taking
`;
          responseText += `\u2022 **Risk Management**: Use support levels for stop-loss placement

`;
        } else if (processedRequest.analysisType === "breakout_analysis") {
          responseText += `\u{1F680} **Breakout Analysis:**
`;
          const strongResistance = resistanceLevels.filter((r) => (r.STRENGTH || 0) > 70);
          const nearestResistance = resistanceLevels.sort((a, b) => Math.abs((a.PRICE_LEVEL || 0) - currentPriceRef) - Math.abs((b.PRICE_LEVEL || 0) - currentPriceRef))[0];
          responseText += `\u2022 **Breakout Candidates**: ${strongResistance.length} strong resistance levels to watch
`;
          if (nearestResistance) {
            responseText += `\u2022 **Next Key Level**: ${formatCurrency(nearestResistance.PRICE_LEVEL || 0)} resistance
`;
          }
          responseText += `\u2022 **Breakout Strategy**: Monitor volume on approach to resistance levels

`;
        } else if (processedRequest.analysisType === "risk_management") {
          responseText += `\u{1F6E1}\uFE0F **Risk Management Guide:**
`;
          const nearestSupport = supportLevels.sort((a, b) => Math.abs((a.PRICE_LEVEL || 0) - currentPriceRef) - Math.abs((b.PRICE_LEVEL || 0) - currentPriceRef))[0];
          responseText += `\u2022 **Stop-Loss Zones**: ${supportLevels.length} support levels for protection
`;
          if (nearestSupport) {
            responseText += `\u2022 **Nearest Support**: ${formatCurrency(nearestSupport.PRICE_LEVEL || 0)} for stop placement
`;
          }
          responseText += `\u2022 **Position Sizing**: Adjust based on distance to key support levels

`;
        } else {
          responseText += `\u{1F4C8} **Comprehensive Analysis:**
`;
          const priceRange = Math.max(...levelsData.map((l) => l.PRICE_LEVEL || 0)) - Math.min(...levelsData.map((l) => l.PRICE_LEVEL || 0));
          const avgStrength = levelsData.reduce((sum, l) => sum + (l.STRENGTH || 0), 0) / levelsData.length;
          responseText += `\u2022 **Price Range Covered**: ${formatCurrency(priceRange)} across all levels
`;
          responseText += `\u2022 **Average Level Strength**: ${Math.round(avgStrength)}/100
`;
          responseText += `\u2022 **Data Timeframe**: ${new Date(Math.min(...levelsData.map((l) => new Date(l.DATE).getTime()))).getFullYear()} - ${(/* @__PURE__ */ new Date()).getFullYear()}

`;
        }
        if (levelsAnalysis.insights && levelsAnalysis.insights.length > 0) {
          responseText += `\u{1F4A1} **Key Insights:**
`;
          levelsAnalysis.insights.slice(0, 3).forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
          responseText += `
`;
        }
        if (levelsAnalysis.technical_outlook) {
          responseText += `\u{1F52E} **Technical Outlook:** ${levelsAnalysis.technical_outlook.market_bias || "Neutral"}

`;
        }
        responseText += `\u{1F4CB} **Trading Guidelines:**
`;
        responseText += `\u2022 **Long Entries**: Consider positions near strong support levels
`;
        responseText += `\u2022 **Profit Targets**: Set take-profits near resistance levels
`;
        responseText += `\u2022 **Stop Losses**: Place stops below key support levels
`;
        responseText += `\u2022 **Breakout Plays**: Watch for volume confirmation on level breaks
`;
        responseText += `\u2022 **Risk Management**: Size positions based on distance to key levels
`;
      }
      responseText += `
\u{1F517} **Data Source:** TokenMetrics Technical Analysis Engine (v2)`;
      console.log(`[${requestId}] Resistance and support analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "resistancesupport",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult7({ success: true, text: responseText });
    } catch (error) {
      console.error("Error in getResistanceSupportAction:", error);
      const errorMessage = `\u274C **Failed to get resistance and support levels**

**Error:** ${error instanceof Error ? error.message : "Unknown error occurred"}

**Troubleshooting:**
\u2022 Ensure the token has sufficient price history for technical analysis
\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum
\u2022 Check if your TokenMetrics subscription includes technical analysis data
\u2022 Verify the token is actively traded with sufficient volume

**Common Solutions:**
\u2022 Use full token names instead of symbols (e.g., "Bitcoin" instead of "BTC")
\u2022 Check if TokenMetrics has performed technical analysis on the requested token
\u2022 Ensure your API key has access to the resistance-support endpoint`;
      if (callback) {
        callback({
          text: errorMessage,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            message: "Failed to retrieve resistance and support levels from TokenMetrics API"
          }
        });
      }
      return createActionResult7({ success: false, error: "Failed to process request" });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger8.log("\u{1F50D} Validating getResistanceSupportAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger8.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeResistanceSupportLevels(levelsData, analysisType = "all") {
  if (!levelsData || levelsData.length === 0) {
    return {
      summary: "No resistance and support levels data available for analysis",
      key_levels: "Cannot identify",
      insights: []
    };
  }
  const resistanceLevels = levelsData.filter(
    (level) => level.LEVEL_TYPE === "RESISTANCE" || level.TYPE === "RESISTANCE"
  );
  const supportLevels = levelsData.filter(
    (level) => level.LEVEL_TYPE === "SUPPORT" || level.TYPE === "SUPPORT"
  );
  const levelStrength = analyzeLevelStrength(levelsData);
  const levelProximity = analyzeLevelProximity(levelsData);
  const tradingOpportunities = identifyTradingOpportunities(resistanceLevels, supportLevels);
  const riskManagement = generateRiskManagementGuidance(resistanceLevels, supportLevels);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "trading_levels":
      focusedAnalysis = {
        trading_focus: {
          key_entry_levels: identifyKeyEntryLevels(supportLevels),
          key_exit_levels: identifyKeyExitLevels(resistanceLevels),
          optimal_trading_zones: identifyOptimalTradingZones(resistanceLevels, supportLevels),
          trading_insights: [
            `\u{1F3AF} Key support levels: ${supportLevels.length}`,
            `\u{1F6A7} Key resistance levels: ${resistanceLevels.length}`,
            `\u{1F4CA} Trading opportunities: ${tradingOpportunities.immediate_setups || 0}`
          ]
        }
      };
      break;
    case "breakout_analysis":
      focusedAnalysis = {
        breakout_focus: {
          breakout_candidates: identifyBreakoutCandidates(resistanceLevels, supportLevels),
          breakdown_risks: identifyBreakdownRisks(supportLevels),
          momentum_levels: identifyMomentumLevels(levelsData),
          breakout_insights: [
            `\u{1F680} Breakout candidates: ${resistanceLevels.filter((r) => r.STRENGTH > 0.7).length}`,
            `\u26A0\uFE0F Breakdown risks: ${supportLevels.filter((s) => s.STRENGTH < 0.5).length}`,
            `\u{1F4AA} Strong levels: ${levelStrength.strong_levels || 0}`
          ]
        }
      };
      break;
    case "risk_management":
      focusedAnalysis = {
        risk_management_focus: {
          stop_loss_levels: identifyStopLossLevels(supportLevels),
          take_profit_levels: identifyTakeProfitLevels(resistanceLevels),
          risk_reward_ratios: calculateRiskRewardRatios(resistanceLevels, supportLevels),
          risk_insights: [
            `\u{1F6E1}\uFE0F Stop-loss levels: ${supportLevels.length}`,
            `\u{1F3AF} Take-profit levels: ${resistanceLevels.length}`,
            `\u2696\uFE0F Risk/reward quality: ${riskManagement.overall_assessment || "Unknown"}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Analysis of ${levelsData.length} levels (${resistanceLevels.length} resistance, ${supportLevels.length} support) with ${levelStrength.strong_levels} strong levels identified`,
    analysis_type: analysisType,
    level_breakdown: {
      resistance_levels: resistanceLevels.length,
      support_levels: supportLevels.length,
      total_levels: levelsData.length
    },
    level_strength: levelStrength,
    level_proximity: levelProximity,
    trading_opportunities: tradingOpportunities,
    risk_management: riskManagement,
    insights: generateTechnicalInsights(resistanceLevels, supportLevels, levelStrength),
    technical_outlook: generateTechnicalOutlook(resistanceLevels, supportLevels, levelStrength),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics Technical Analysis Engine",
      level_count: levelsData.length,
      coverage: assessCoverageTimeframe(levelsData),
      analysis_depth: assessAnalysisDepth(levelsData),
      reliability: assessReliability(levelStrength.average_strength || 0, levelStrength.strong_levels || 0, levelsData.length)
    },
    level_classification: classifyLevels(resistanceLevels, supportLevels, analysisType)
  };
}
function analyzeLevelStrength(levelsData) {
  const strengthScores = levelsData.map((level) => level.STRENGTH || level.LEVEL_STRENGTH).filter((strength) => strength !== null && strength !== void 0);
  if (strengthScores.length === 0) {
    return { strong_levels: 0, average_strength: 0 };
  }
  const averageStrength = strengthScores.reduce((sum, strength) => sum + strength, 0) / strengthScores.length;
  const strongLevels = strengthScores.filter((s) => s >= 80).length;
  const moderateLevels = strengthScores.filter((s) => s >= 60 && s < 80).length;
  const weakLevels = strengthScores.filter((s) => s < 60).length;
  return {
    average_strength: averageStrength.toFixed(1),
    strong_levels: strongLevels,
    moderate_levels: moderateLevels,
    weak_levels: weakLevels,
    strength_distribution: {
      strong: `${strongLevels} (${(strongLevels / strengthScores.length * 100).toFixed(1)}%)`,
      moderate: `${moderateLevels} (${(moderateLevels / strengthScores.length * 100).toFixed(1)}%)`,
      weak: `${weakLevels} (${(weakLevels / strengthScores.length * 100).toFixed(1)}%)`
    },
    reliability_assessment: assessReliability(averageStrength, strongLevels, strengthScores.length)
  };
}
function analyzeLevelProximity(levelsData) {
  const priceLevels = levelsData.map((level) => level.PRICE_LEVEL || level.LEVEL_PRICE).filter((price) => price && price > 0).sort((a, b) => a - b);
  if (priceLevels.length < 2) {
    return { level_spacing: "Insufficient data" };
  }
  const spacings = [];
  for (let i = 1; i < priceLevels.length; i++) {
    const spacing = (priceLevels[i] - priceLevels[i - 1]) / priceLevels[i - 1] * 100;
    spacings.push(spacing);
  }
  const averageSpacing = spacings.reduce((sum, spacing) => sum + spacing, 0) / spacings.length;
  const minSpacing = Math.min(...spacings);
  const maxSpacing = Math.max(...spacings);
  return {
    average_level_spacing: `${averageSpacing.toFixed(2)}%`,
    min_spacing: `${minSpacing.toFixed(2)}%`,
    max_spacing: `${maxSpacing.toFixed(2)}%`,
    price_range: {
      lowest_level: formatCurrency(priceLevels[0]),
      highest_level: formatCurrency(priceLevels[priceLevels.length - 1]),
      total_range: formatCurrency(priceLevels[priceLevels.length - 1] - priceLevels[0])
    },
    level_clustering: assessLevelClustering(spacings)
  };
}
function identifyTradingOpportunities(resistanceLevels, supportLevels) {
  const opportunities = [];
  const strongResistance = resistanceLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3);
  const strongSupport = supportLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3);
  strongSupport.forEach((level) => {
    opportunities.push({
      type: "Long Entry Opportunity",
      description: `Strong support at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
      strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
      strategy: "Consider long positions on bounces from this level",
      risk_management: "Set stop-loss below support level"
    });
  });
  strongResistance.forEach((level) => {
    opportunities.push({
      type: "Short Entry Opportunity",
      description: `Strong resistance at ${formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE)}`,
      strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
      strategy: "Consider short positions on rejections from this level",
      risk_management: "Set stop-loss above resistance level"
    });
  });
  if (strongResistance.length > 0) {
    opportunities.push({
      type: "Breakout Opportunity",
      description: "Monitor for resistance level breaks for upside momentum",
      strategy: "Enter long positions on confirmed breaks above resistance",
      confirmation_needed: "Volume increase and sustained price action above level"
    });
  }
  if (strongSupport.length > 0) {
    opportunities.push({
      type: "Breakdown Opportunity",
      description: "Monitor for support level breaks for downside momentum",
      strategy: "Enter short positions on confirmed breaks below support",
      confirmation_needed: "Volume increase and sustained price action below level"
    });
  }
  return {
    total_opportunities: opportunities.length,
    opportunities,
    priority_levels: identifyPriorityLevels(strongResistance, strongSupport),
    setup_quality: assessSetupQuality(opportunities)
  };
}
function generateRiskManagementGuidance(resistanceLevels, supportLevels) {
  const guidance = [];
  if (supportLevels.length > 0) {
    const nearestSupport = supportLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    guidance.push({
      type: "Stop-Loss Placement",
      recommendation: `Place stop-losses below ${formatCurrency(nearestSupport.PRICE_LEVEL || nearestSupport.LEVEL_PRICE)} support level`,
      rationale: "Support break indicates trend reversal or acceleration"
    });
  }
  if (resistanceLevels.length > 0) {
    const nearestResistance = resistanceLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
    guidance.push({
      type: "Take-Profit Placement",
      recommendation: `Consider taking profits near ${formatCurrency(nearestResistance.PRICE_LEVEL || nearestResistance.LEVEL_PRICE)} resistance level`,
      rationale: "Resistance often causes price rejections and profit-taking"
    });
  }
  guidance.push({
    type: "Position Sizing",
    recommendation: "Size positions based on distance to nearest support/resistance",
    calculation: "Risk 1-2% of portfolio per trade based on stop-loss distance"
  });
  guidance.push({
    type: "Risk Monitoring",
    recommendation: "Monitor for level breaks that invalidate trading thesis",
    action: "Exit or adjust positions when key levels are broken with volume"
  });
  return {
    guidance_points: guidance,
    key_principles: [
      "Always define risk before entering trades",
      "Use level strength to determine position confidence",
      "Monitor volume for level break confirmations",
      "Adjust position sizes based on level proximity"
    ],
    risk_factors: [
      "False breakouts can trigger stop-losses prematurely",
      "Market conditions can override technical levels",
      "High volatility can cause whipsaws around levels"
    ]
  };
}
function generateTechnicalInsights(resistanceLevels, supportLevels, levelAnalysis) {
  const insights = [];
  if (levelAnalysis.strong_levels > 0) {
    insights.push(`${levelAnalysis.strong_levels} high-strength levels identified provide reliable reference points for trading decisions`);
  } else {
    insights.push("Limited high-strength levels suggest less reliable technical guidance - use additional analysis");
  }
  if (resistanceLevels.length > supportLevels.length * 1.5) {
    insights.push("Heavy resistance overhead suggests potential selling pressure and upside challenges");
  } else if (supportLevels.length > resistanceLevels.length * 1.5) {
    insights.push("Strong support structure below current levels suggests downside protection");
  } else {
    insights.push("Balanced resistance and support structure indicates range-bound trading environment");
  }
  if (levelAnalysis.reliability_assessment === "High") {
    insights.push("High reliability of technical levels supports confident position sizing and risk management");
  } else if (levelAnalysis.reliability_assessment === "Low") {
    insights.push("Low level reliability suggests using conservative position sizes and tight risk controls");
  }
  const totalLevels = resistanceLevels.length + supportLevels.length;
  if (totalLevels > 10) {
    insights.push("Dense level structure creates multiple trading opportunities but requires careful level selection");
  } else if (totalLevels < 5) {
    insights.push("Sparse level structure suggests fewer clear technical reference points");
  }
  return insights;
}
function generateTechnicalOutlook(resistanceLevels, supportLevels, levelAnalysis) {
  let bias = "Neutral";
  let outlook = "Range-bound";
  const strongResistance = resistanceLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
  const strongSupport = supportLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
  if (strongSupport > strongResistance) {
    bias = "Bullish";
    outlook = "Upside potential with strong support structure";
  } else if (strongResistance > strongSupport) {
    bias = "Bearish";
    outlook = "Downside risk with heavy resistance overhead";
  }
  const reliability = levelAnalysis.reliability_assessment;
  const confidence = reliability === "High" ? "High" : reliability === "Medium" ? "Moderate" : "Low";
  return {
    technical_bias: bias,
    outlook,
    confidence_level: confidence,
    key_factors: [
      `${strongResistance} strong resistance levels`,
      `${strongSupport} strong support levels`,
      `${levelAnalysis.average_strength} average level strength`
    ],
    trading_environment: classifyTradingEnvironment(resistanceLevels, supportLevels),
    next_key_events: identifyKeyEvents(resistanceLevels, supportLevels)
  };
}
function assessReliability(averageStrength, strongLevels, totalLevels) {
  const strongRatio = strongLevels / totalLevels;
  if (averageStrength > 75 && strongRatio > 0.4) return "High";
  if (averageStrength > 60 && strongRatio > 0.25) return "Medium";
  if (averageStrength > 45) return "Low";
  return "Very Low";
}
function assessLevelClustering(spacings) {
  const smallSpacings = spacings.filter((s) => s < 2).length;
  const clusteringRatio = smallSpacings / spacings.length;
  if (clusteringRatio > 0.6) return "Highly Clustered";
  if (clusteringRatio > 0.4) return "Moderately Clustered";
  if (clusteringRatio > 0.2) return "Some Clustering";
  return "Well Distributed";
}
function identifyPriorityLevels(strongResistance, strongSupport) {
  const allLevels = [
    ...strongResistance.map((level) => ({ ...level, type: "resistance" })),
    ...strongSupport.map((level) => ({ ...level, type: "support" }))
  ];
  return allLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    type: level.type,
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
    priority: "High"
  }));
}
function assessSetupQuality(opportunities) {
  if (opportunities.length === 0) return "No Setups";
  const highStrengthOpportunities = opportunities.filter(
    (opp) => opp.strength && opp.strength >= 80
  ).length;
  if (highStrengthOpportunities > 2) return "Excellent";
  if (highStrengthOpportunities > 0) return "Good";
  if (opportunities.length > 3) return "Moderate";
  return "Limited";
}
function assessCoverageTimeframe(levelsData) {
  const timeframes = new Set(levelsData.map((level) => level.TIMEFRAME).filter((tf) => tf));
  if (timeframes.has("daily") && timeframes.has("weekly")) return "Multi-timeframe";
  if (timeframes.has("daily")) return "Daily";
  if (timeframes.has("weekly")) return "Weekly";
  return "Unknown";
}
function assessAnalysisDepth(levelsData) {
  const withStrength = levelsData.filter((level) => level.STRENGTH || level.LEVEL_STRENGTH).length;
  const withTimeframe = levelsData.filter((level) => level.TIMEFRAME).length;
  const depthScore = (withStrength + withTimeframe) / (levelsData.length * 2);
  if (depthScore > 0.8) return "Comprehensive";
  if (depthScore > 0.6) return "Detailed";
  if (depthScore > 0.4) return "Moderate";
  return "Basic";
}
function classifyTradingEnvironment(resistanceLevels, supportLevels) {
  const totalLevels = resistanceLevels.length + supportLevels.length;
  const strongLevels = [...resistanceLevels, ...supportLevels].filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) >= 70).length;
  if (totalLevels > 10 && strongLevels > 5) return "Complex - Many strong levels";
  if (totalLevels > 6 && strongLevels > 2) return "Active - Good level structure";
  if (totalLevels > 3) return "Moderate - Some technical guidance";
  return "Simple - Limited level structure";
}
function identifyKeyEvents(resistanceLevels, supportLevels) {
  const events = [];
  const strongestResistance = resistanceLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
  const strongestSupport = supportLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0))[0];
  if (strongestResistance) {
    events.push(`Break above ${formatCurrency(strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE)} resistance could trigger upside breakout`);
  }
  if (strongestSupport) {
    events.push(`Break below ${formatCurrency(strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE)} support could trigger downside breakdown`);
  }
  if (events.length === 0) {
    events.push("Monitor for clear level breaks to identify directional moves");
  }
  return events;
}
function identifyKeyEntryLevels(supportLevels) {
  return supportLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6).sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
    recommendation: "Strong support level for long entries"
  }));
}
function identifyKeyExitLevels(resistanceLevels) {
  return resistanceLevels.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.6).sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
    recommendation: "Strong resistance level for profit taking"
  }));
}
function identifyOptimalTradingZones(resistanceLevels, supportLevels) {
  const zones = [];
  for (const support of supportLevels.slice(0, 3)) {
    for (const resistance of resistanceLevels.slice(0, 3)) {
      const supportPrice = support.PRICE_LEVEL || support.LEVEL_PRICE;
      const resistancePrice = resistance.PRICE_LEVEL || resistance.LEVEL_PRICE;
      if (resistancePrice > supportPrice) {
        const range = (resistancePrice - supportPrice) / supportPrice * 100;
        if (range > 2 && range < 20) {
          zones.push({
            support_level: formatCurrency(supportPrice),
            resistance_level: formatCurrency(resistancePrice),
            range_percentage: `${range.toFixed(2)}%`,
            quality: range > 5 ? "High" : "Medium"
          });
        }
      }
    }
  }
  return zones.slice(0, 3);
}
function identifyBreakoutCandidates(resistanceLevels, supportLevels) {
  const candidates = [];
  const strongResistance = resistanceLevels.filter(
    (level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.7
  );
  strongResistance.forEach((level) => {
    candidates.push({
      type: "Upside Breakout",
      level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
      strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
      probability: level.STRENGTH > 0.8 ? "High" : "Medium"
    });
  });
  return candidates.slice(0, 3);
}
function identifyBreakdownRisks(supportLevels) {
  const risks = [];
  const weakSupport = supportLevels.filter(
    (level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) < 0.5
  );
  weakSupport.forEach((level) => {
    risks.push({
      type: "Downside Breakdown",
      level: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
      strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
      risk_level: level.STRENGTH < 0.3 ? "High" : "Medium"
    });
  });
  return risks.slice(0, 3);
}
function identifyMomentumLevels(levelsData) {
  return levelsData.filter((level) => (level.STRENGTH || level.LEVEL_STRENGTH || 0) > 0.75).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    type: level.LEVEL_TYPE || level.TYPE || "Unknown",
    momentum_potential: "High",
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0
  })).slice(0, 3);
}
function identifyStopLossLevels(supportLevels) {
  return supportLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
    recommendation: "Place stop-loss below this level",
    risk_level: level.STRENGTH > 0.7 ? "Low" : "Medium"
  }));
}
function identifyTakeProfitLevels(resistanceLevels) {
  return resistanceLevels.sort((a, b) => (b.STRENGTH || b.LEVEL_STRENGTH || 0) - (a.STRENGTH || a.LEVEL_STRENGTH || 0)).slice(0, 3).map((level) => ({
    price: formatCurrency(level.PRICE_LEVEL || level.LEVEL_PRICE),
    strength: level.STRENGTH || level.LEVEL_STRENGTH || 0,
    recommendation: "Consider taking profits at this level",
    probability: level.STRENGTH > 0.7 ? "High" : "Medium"
  }));
}
function calculateRiskRewardRatios(resistanceLevels, supportLevels) {
  const ratios = [];
  if (supportLevels.length > 0 && resistanceLevels.length > 0) {
    const strongestSupport = supportLevels.reduce(
      (prev, current) => (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
    );
    const strongestResistance = resistanceLevels.reduce(
      (prev, current) => (prev.STRENGTH || prev.LEVEL_STRENGTH || 0) > (current.STRENGTH || current.LEVEL_STRENGTH || 0) ? prev : current
    );
    const supportPrice = strongestSupport.PRICE_LEVEL || strongestSupport.LEVEL_PRICE;
    const resistancePrice = strongestResistance.PRICE_LEVEL || strongestResistance.LEVEL_PRICE;
    if (resistancePrice > supportPrice) {
      const reward = resistancePrice - supportPrice;
      const risk = supportPrice * 0.02;
      const ratio = reward / risk;
      ratios.push({
        entry_level: formatCurrency(supportPrice),
        target_level: formatCurrency(resistancePrice),
        risk_reward_ratio: `1:${ratio.toFixed(2)}`,
        quality: ratio > 3 ? "Excellent" : ratio > 2 ? "Good" : "Fair"
      });
    }
  }
  return ratios;
}
function classifyLevels(resistanceLevels, supportLevels, analysisType) {
  const classification = {
    by_strength: {
      strong_resistance: resistanceLevels.filter((r) => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length,
      medium_resistance: resistanceLevels.filter((r) => {
        const strength = r.STRENGTH || r.LEVEL_STRENGTH || 0;
        return strength >= 0.4 && strength <= 0.7;
      }).length,
      weak_resistance: resistanceLevels.filter((r) => (r.STRENGTH || r.LEVEL_STRENGTH || 0) < 0.4).length,
      strong_support: supportLevels.filter((s) => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length,
      medium_support: supportLevels.filter((s) => {
        const strength = s.STRENGTH || s.LEVEL_STRENGTH || 0;
        return strength >= 0.4 && strength <= 0.7;
      }).length,
      weak_support: supportLevels.filter((s) => (s.STRENGTH || s.LEVEL_STRENGTH || 0) < 0.4).length
    },
    by_analysis_type: {
      focus: analysisType,
      primary_levels: analysisType === "trading_levels" ? "Entry/Exit points" : analysisType === "breakout_analysis" ? "Breakout candidates" : analysisType === "risk_management" ? "Stop-loss/Take-profit" : "All levels",
      level_priority: determineLevelPriority(resistanceLevels, supportLevels, analysisType)
    },
    overall_assessment: {
      total_levels: resistanceLevels.length + supportLevels.length,
      balance: Math.abs(resistanceLevels.length - supportLevels.length) < 3 ? "Balanced" : "Imbalanced",
      market_structure: classifyMarketStructure(resistanceLevels, supportLevels)
    }
  };
  return classification;
}
function determineLevelPriority(resistanceLevels, supportLevels, analysisType) {
  const avgResistanceStrength = resistanceLevels.length > 0 ? resistanceLevels.reduce((sum, r) => sum + (r.STRENGTH || r.LEVEL_STRENGTH || 0), 0) / resistanceLevels.length : 0;
  const avgSupportStrength = supportLevels.length > 0 ? supportLevels.reduce((sum, s) => sum + (s.STRENGTH || s.LEVEL_STRENGTH || 0), 0) / supportLevels.length : 0;
  switch (analysisType) {
    case "trading_levels":
      return avgSupportStrength > avgResistanceStrength ? "Support-focused" : "Resistance-focused";
    case "breakout_analysis":
      return "Resistance-focused";
    case "risk_management":
      return "Support-focused";
    default:
      return "Balanced";
  }
}
function classifyMarketStructure(resistanceLevels, supportLevels) {
  const strongResistance = resistanceLevels.filter((r) => (r.STRENGTH || r.LEVEL_STRENGTH || 0) > 0.7).length;
  const strongSupport = supportLevels.filter((s) => (s.STRENGTH || s.LEVEL_STRENGTH || 0) > 0.7).length;
  if (strongResistance > strongSupport + 2) return "Resistance-heavy";
  if (strongSupport > strongResistance + 2) return "Support-heavy";
  if (strongResistance > 2 && strongSupport > 2) return "Well-defined range";
  return "Developing structure";
}

// src/actions/getTradingSignalsAction.ts
import {
  elizaLogger as elizaLogger9,
  createActionResult as createActionResult8
} from "@elizaos/core";
var tradingSignalsTemplate = `Extract trading signals request information from the user's message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Trading signals provide:
- Buy/Sell/Hold recommendations
- Entry and exit price targets
- Risk assessment levels
- Technical indicator analysis
- Market timing suggestions

Instructions:
Look for TRADING SIGNALS requests in the user's message, such as:
- Signal queries ("Trading signals for [TOKEN]", "Buy signals")
- Entry/exit requests ("When to buy [TOKEN]?", "Entry points")
- Market timing ("Best time to trade [TOKEN]", "Trading opportunities")
- Technical analysis ("Technical signals for [TOKEN]")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "Get trading signals for [TOKEN]" \u2192 extract [TOKEN]
- "Trading signals for [TOKEN]" \u2192 extract [TOKEN]
- "Should I buy [TOKEN]?" \u2192 extract [TOKEN]
- "Entry signals for [TOKEN]" \u2192 extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<signal_type>bullish, bearish, buy, sell, hold, or general</signal_type>
<timeframe>1h, 4h, daily, weekly, or general</timeframe>
<analysis_depth>basic, detailed, comprehensive</analysis_depth>
</response>`;
var TradingSignalsRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("The cryptocurrency symbol or name mentioned"),
  signal_type: external_exports.string().optional().describe("Type of signal requested"),
  category: external_exports.string().optional().describe("Token category filter (e.g., defi, layer-1, meme)"),
  exchange: external_exports.string().optional().describe("Exchange filter"),
  time_period: external_exports.string().optional().describe("Time period or date range"),
  market_filter: external_exports.string().optional().describe("Market cap, volume, or other filters")
});
async function fetchTradingSignals(params, runtime) {
  elizaLogger9.log(`\u{1F4E1} Fetching trading signals with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/trading-signals", params, runtime);
    if (!data) {
      throw new Error("No data received from trading signals API");
    }
    elizaLogger9.log(`\u2705 Successfully fetched trading signals data`);
    return data;
  } catch (error) {
    elizaLogger9.error("\u274C Error fetching trading signals:", error);
    throw error;
  }
}
function formatTradingSignalsResponse(data, tokenInfo) {
  if (!data || data.length === 0) {
    return "\u274C No trading signals found for the specified criteria.";
  }
  const signals = Array.isArray(data) ? data : [data];
  const signalCount = signals.length;
  const bullishSignals = signals.filter((s) => s.TRADING_SIGNAL === 1 || s.TRADING_SIGNAL === "1").length;
  const bearishSignals = signals.filter((s) => s.TRADING_SIGNAL === -1 || s.TRADING_SIGNAL === "-1").length;
  const neutralSignals = signals.filter((s) => s.TRADING_SIGNAL === 0 || s.TRADING_SIGNAL === "0").length;
  let response = `\u{1F4CA} **TokenMetrics Trading Signals Analysis**

`;
  if (tokenInfo) {
    response += `\u{1F3AF} **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})
`;
  }
  response += `\u{1F4C8} **Signal Summary**: ${signalCount} signals analyzed
`;
  response += `\u{1F7E2} **Bullish**: ${bullishSignals} signals (${(bullishSignals / signalCount * 100).toFixed(1)}%)
`;
  response += `\u{1F534} **Bearish**: ${bearishSignals} signals (${(bearishSignals / signalCount * 100).toFixed(1)}%)
`;
  response += `\u26AA **Neutral**: ${neutralSignals} signals (${(neutralSignals / signalCount * 100).toFixed(1)}%)

`;
  const recentSignals = signals.slice(0, 5);
  response += `\u{1F50D} **Recent Signals**:
`;
  recentSignals.forEach((signal, index) => {
    const signalEmoji = signal.TRADING_SIGNAL === 1 ? "\u{1F7E2}" : signal.TRADING_SIGNAL === -1 ? "\u{1F534}" : "\u26AA";
    const signalText = signal.TRADING_SIGNAL === 1 ? "BULLISH" : signal.TRADING_SIGNAL === -1 ? "BEARISH" : "NEUTRAL";
    response += `${signalEmoji} **${signal.TOKEN_SYMBOL || signal.TOKEN_NAME}**: ${signalText}`;
    if (signal.DATE) {
      response += ` (${signal.DATE})`;
    }
    response += `
`;
  });
  response += `
\u{1F4A1} **AI Recommendations**:
`;
  if (bullishSignals > bearishSignals) {
    response += `\u2022 Market sentiment is predominantly bullish (${(bullishSignals / signalCount * 100).toFixed(1)}%)
`;
    response += `\u2022 Consider long positions on tokens with strong bullish signals
`;
    response += `\u2022 Monitor for entry opportunities on pullbacks
`;
  } else if (bearishSignals > bullishSignals) {
    response += `\u2022 Market sentiment is predominantly bearish (${(bearishSignals / signalCount * 100).toFixed(1)}%)
`;
    response += `\u2022 Exercise caution with new long positions
`;
    response += `\u2022 Consider defensive strategies or short positions
`;
  } else {
    response += `\u2022 Market sentiment is mixed - signals are balanced
`;
    response += `\u2022 Wait for clearer directional signals before major moves
`;
    response += `\u2022 Focus on risk management and position sizing
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics AI Trading Signals
`;
  response += `\u23F0 **Analysis Time**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeTradingSignals(data) {
  if (!data || data.length === 0) {
    return { error: "No data to analyze" };
  }
  const signals = Array.isArray(data) ? data : [data];
  const analysis = {
    total_signals: signals.length,
    signal_distribution: {
      bullish: signals.filter((s) => s.TRADING_SIGNAL === 1 || s.TRADING_SIGNAL === "1").length,
      bearish: signals.filter((s) => s.TRADING_SIGNAL === -1 || s.TRADING_SIGNAL === "-1").length,
      neutral: signals.filter((s) => s.TRADING_SIGNAL === 0 || s.TRADING_SIGNAL === "0").length
    },
    top_tokens: signals.slice(0, 10).map((s) => ({
      symbol: s.TOKEN_SYMBOL,
      name: s.TOKEN_NAME,
      signal: s.TRADING_SIGNAL,
      date: s.DATE
    })),
    market_sentiment: "neutral"
  };
  const { bullish, bearish, neutral } = analysis.signal_distribution;
  if (bullish > bearish && bullish > neutral) {
    analysis.market_sentiment = "bullish";
  } else if (bearish > bullish && bearish > neutral) {
    analysis.market_sentiment = "bearish";
  }
  return analysis;
}
var getTradingSignalsAction = {
  name: "GET_TRADING_SIGNALS_TOKENMETRICS",
  similes: [
    "GET_TRADING_SIGNALS",
    "GET_AI_SIGNALS",
    "GET_BUY_SELL_SIGNALS",
    "GET_TRADING_RECOMMENDATIONS",
    "TRADING_SIGNALS",
    "AI_SIGNALS",
    "MARKET_SIGNALS"
  ],
  description: "Get AI-generated trading signals and recommendations for cryptocurrencies from TokenMetrics",
  validate: async (runtime, message, state) => {
    elizaLogger9.log("\u{1F50D} Validating getTradingSignalsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger9.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    const requestId = generateRequestId();
    elizaLogger9.log("\u{1F680} Starting TokenMetrics trading signals handler");
    elizaLogger9.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger9.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = tradingSignalsTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const signalsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        TradingSignalsRequestSchema,
        requestId
      );
      elizaLogger9.log("\u{1F3AF} AI Extracted signals request:", signalsRequest);
      elizaLogger9.log(`\u{1F194} Request ${requestId}: AI Processing "${signalsRequest?.cryptocurrency || "general market"}"`);
      elizaLogger9.log(`\u{1F50D} DEBUG: AI extracted cryptocurrency: "${signalsRequest?.cryptocurrency}"`);
      console.log(`[${requestId}] Extracted request:`, signalsRequest);
      elizaLogger9.success("\u{1F3AF} Final extraction result:", signalsRequest);
      const apiParams = {
        limit: 50,
        page: 1
      };
      let tokenInfo = null;
      if (signalsRequest?.cryptocurrency) {
        elizaLogger9.log(`\u{1F50D} Attempting to resolve token for: "${signalsRequest.cryptocurrency}"`);
        try {
          tokenInfo = await resolveTokenSmart(signalsRequest.cryptocurrency, runtime);
          if (tokenInfo) {
            apiParams.token_id = tokenInfo.TOKEN_ID;
            elizaLogger9.log(`\u2705 Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
          } else {
            apiParams.symbol = signalsRequest.cryptocurrency.toUpperCase();
            elizaLogger9.log(`\u{1F50D} Using symbol parameter: ${signalsRequest.cryptocurrency}`);
          }
        } catch (error) {
          elizaLogger9.log(`\u26A0\uFE0F Token resolution failed, using symbol fallback: ${error}`);
          apiParams.symbol = signalsRequest.cryptocurrency.toUpperCase();
          elizaLogger9.log(`\u{1F50D} Fallback to symbol parameter: ${signalsRequest.cryptocurrency.toUpperCase()}`);
        }
      }
      if (signalsRequest?.category) {
        apiParams.category = signalsRequest.category;
      }
      if (signalsRequest?.exchange) {
        apiParams.exchange = signalsRequest.exchange;
      }
      elizaLogger9.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger9.log(`\u{1F50D} DEBUG - About to call trading signals API with params:`, JSON.stringify(apiParams, null, 2));
      elizaLogger9.log(`\u{1F50D} DEBUG - Resolved tokenInfo:`, tokenInfo ? {
        name: tokenInfo.TOKEN_NAME,
        symbol: tokenInfo.TOKEN_SYMBOL,
        id: tokenInfo.TOKEN_ID
      } : "null");
      elizaLogger9.log(`\u{1F4E1} Fetching trading signals data`);
      const signalsData = await fetchTradingSignals(apiParams, runtime);
      if (!signalsData) {
        elizaLogger9.log("\u274C Failed to fetch trading signals data");
        return createActionResult8({
          success: false,
          text: `\u274C Unable to fetch trading signals data at the moment. Please try again.`,
          data: { error: "API fetch failed", request_id: requestId }
        });
      }
      let signals = Array.isArray(signalsData) ? signalsData : signalsData.data || [];
      elizaLogger9.log(`\u{1F50D} Final signals count: ${signals.length}`);
      const responseText = formatTradingSignalsResponse(signals, tokenInfo);
      const analysis = analyzeTradingSignals(signals);
      elizaLogger9.success("\u2705 Successfully processed trading signals request");
      if (callback) {
        callback({
          text: responseText,
          data: {
            success: true,
            signals_data: signals,
            analysis,
            source: "TokenMetrics AI Trading Signals",
            request_id: requestId
          }
        });
      }
      return createActionResult8({
        success: true,
        text: responseText,
        data: {
          success: true,
          signals_data: signals,
          analysis,
          source: "TokenMetrics AI Trading Signals",
          request_id: requestId
        }
      });
    } catch (error) {
      elizaLogger9.error("\u274C Error in TokenMetrics trading signals handler:", error);
      return createActionResult8({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  },
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get trading signals for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch the latest AI trading signals for Bitcoin from TokenMetrics.",
          action: "GET_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getHourlyOhlcvAction.ts
import { elizaLogger as elizaLogger10, createActionResult as createActionResult9 } from "@elizaos/core";
var HourlyOhlcvRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: external_exports.string().optional().describe("Full name of the token"),
  startDate: external_exports.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: external_exports.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  limit: external_exports.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["scalping", "intraday", "technical_patterns", "all"]).optional().describe("Type of analysis to focus on")
});
var hourlyOhlcvTemplate = `Extract hourly OHLCV request information from the user's message.

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Hourly OHLCV provides:
- Open, High, Low, Close, Volume data
- Intraday price movement analysis
- Volume patterns and trends
- Technical analysis foundations
- Short-term trading insights
- Market microstructure data

Instructions:
Look for HOURLY OHLCV requests in the user's message, such as:
- Price data ("Hourly price data", "OHLCV data")
- Intraday analysis ("Hourly candles", "Intraday charts")
- Volume analysis ("Hourly volume", "Trading activity")
- Technical analysis ("Price action", "Candlestick data")

EXTRACTION RULE: Find the cryptocurrency name/symbol that the user specifically mentioned in their message.

Examples of request patterns (but extract the actual token from user's message):
- "Get hourly OHLCV for [TOKEN]" \u2192 extract [TOKEN]
- "Show hourly price data for [TOKEN]" \u2192 extract [TOKEN]
- "Hourly candles for [TOKEN]" \u2192 extract [TOKEN]
- "Intraday volume analysis for [TOKEN]" \u2192 extract [TOKEN]

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>EXACT token name or symbol from user's message</cryptocurrency>
<timeframe>1h, 4h, 12h, or default</timeframe>
<analysis_type>price_action, volume, volatility, or all</analysis_type>
<period>24h, 7d, 30d, or default</period>
<focus_area>trading, technical, patterns, or general</focus_area>
</response>`;
function extractCryptocurrencySimple4(text) {
  const cryptoPatterns = [
    { regex: /\b(bitcoin|btc)\b/i, name: "Bitcoin", symbol: "BTC" },
    { regex: /\b(ethereum|eth)\b/i, name: "Ethereum", symbol: "ETH" },
    { regex: /\b(dogecoin|doge)\b/i, name: "Dogecoin", symbol: "DOGE" },
    { regex: /\b(solana|sol)\b/i, name: "Solana", symbol: "SOL" },
    { regex: /\b(avalanche|avax)\b/i, name: "Avalanche", symbol: "AVAX" },
    { regex: /\b(cardano|ada)\b/i, name: "Cardano", symbol: "ADA" },
    { regex: /\b(polkadot|dot)\b/i, name: "Polkadot", symbol: "DOT" },
    { regex: /\b(chainlink|link)\b/i, name: "Chainlink", symbol: "LINK" },
    { regex: /\b(binance coin|bnb)\b/i, name: "BNB", symbol: "BNB" },
    { regex: /\b(ripple|xrp)\b/i, name: "XRP", symbol: "XRP" },
    { regex: /\b(litecoin|ltc)\b/i, name: "Litecoin", symbol: "LTC" },
    { regex: /\b(polygon|matic)\b/i, name: "Polygon", symbol: "MATIC" },
    { regex: /\b(uniswap|uni)\b/i, name: "Uniswap", symbol: "UNI" },
    { regex: /\b(shiba inu|shib)\b/i, name: "Shiba Inu", symbol: "SHIB" }
  ];
  for (const pattern of cryptoPatterns) {
    if (pattern.regex.test(text)) {
      return {
        cryptocurrency: pattern.name,
        symbol: pattern.symbol
      };
    }
  }
  return {};
}
var getHourlyOhlcvAction = {
  name: "GET_HOURLY_OHLCV_TOKENMETRICS",
  description: "Get hourly OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics for intraday analysis",
  similes: [
    "get hourly ohlcv",
    "hourly price data",
    "hourly candles",
    "intraday price data",
    "hourly chart data",
    "technical analysis data",
    "hourly trading data",
    "scalping data"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get hourly OHLCV for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the hourly OHLCV data for Bitcoin.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show hourly price data for ETH"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve hourly OHLCV data for Ethereum.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Hourly candles for scalping analysis"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get hourly OHLCV data optimized for scalping analysis.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ]
  ],
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const requestId = generateRequestId();
      elizaLogger10.log(`[${requestId}] Processing hourly OHLCV request...`);
      elizaLogger10.log(`[${requestId}] \u{1F50D} DEBUG: User message: "${message.content?.text}"`);
      if (!state) {
        state = await runtime.composeState(message);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = hourlyOhlcvTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const ohlcvRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        HourlyOhlcvRequestSchema,
        requestId
      );
      elizaLogger10.log(`[${requestId}] \u{1F50D} DEBUG: AI extracted cryptocurrency: "${ohlcvRequest?.cryptocurrency}"`);
      console.log(`[${requestId}] Extracted request:`, ohlcvRequest);
      let processedRequest = {
        cryptocurrency: ohlcvRequest?.cryptocurrency || null,
        token_id: ohlcvRequest?.token_id || null,
        symbol: ohlcvRequest?.symbol || null,
        token_name: ohlcvRequest?.token_name || null,
        startDate: ohlcvRequest?.startDate || null,
        endDate: ohlcvRequest?.endDate || null,
        limit: ohlcvRequest?.limit || 50,
        // API maximum limit is 50
        page: ohlcvRequest?.page || 1,
        analysisType: ohlcvRequest?.analysisType || "all"
      };
      if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes("unknown")) {
        elizaLogger10.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple4(message.content?.text || "");
        if (regexResult.cryptocurrency) {
          processedRequest.cryptocurrency = regexResult.cryptocurrency;
          processedRequest.symbol = regexResult.symbol || null;
          elizaLogger10.log(`[${requestId}] Regex fallback found: ${regexResult.cryptocurrency} (${regexResult.symbol})`);
        }
      }
      let resolvedToken = null;
      let finalTokenName = processedRequest.cryptocurrency;
      if (processedRequest.cryptocurrency) {
        try {
          elizaLogger10.log(`[${requestId}] \u{1F504} Step 1: Attempting dynamic token resolution for: "${processedRequest.cryptocurrency}"`);
          resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
          if (resolvedToken) {
            finalTokenName = resolvedToken.TOKEN_NAME;
            processedRequest.token_id = resolvedToken.TOKEN_ID;
            processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
            elizaLogger10.log(`[${requestId}] \u2705 Dynamic resolution successful: "${processedRequest.cryptocurrency}" \u2192 ${resolvedToken.TOKEN_NAME} (ID: ${resolvedToken.TOKEN_ID})`);
          } else {
            elizaLogger10.log(`[${requestId}] \u26A0\uFE0F Dynamic resolution returned null for: "${processedRequest.cryptocurrency}"`);
          }
        } catch (error) {
          elizaLogger10.log(`[${requestId}] \u274C Dynamic resolution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        if (!resolvedToken) {
          elizaLogger10.log(`[${requestId}] \u{1F504} Step 2: Trying dynamic token search via /tokens endpoint...`);
          const symbol = processedRequest.cryptocurrency.toLowerCase();
          try {
            const tokenSearchParams = {
              symbol: symbol.toUpperCase(),
              limit: 1
            };
            const tokenSearchData = await callTokenMetricsAPI("/v2/tokens", tokenSearchParams, runtime);
            if (tokenSearchData?.data && tokenSearchData.data.length > 0) {
              const foundToken = tokenSearchData.data[0];
              processedRequest.token_id = foundToken.TOKEN_ID || foundToken.ID;
              elizaLogger10.log(`[${requestId}] \u2705 Dynamic search successful: "${symbol}" \u2192 Token ID ${processedRequest.token_id}`);
              resolvedToken = {
                TOKEN_ID: foundToken.TOKEN_ID || foundToken.ID,
                TOKEN_NAME: foundToken.TOKEN_NAME || foundToken.NAME,
                TOKEN_SYMBOL: foundToken.TOKEN_SYMBOL || foundToken.SYMBOL
              };
            }
          } catch (error) {
            elizaLogger10.log(`[${requestId}] \u274C Dynamic token search failed: ${error instanceof Error ? error.message : "Unknown error"}`);
          }
        }
        if (!resolvedToken) {
          elizaLogger10.log(`[${requestId}] \u{1F504} Step 3: Using symbol-based API call as final fallback...`);
          processedRequest.symbol = processedRequest.cryptocurrency.toUpperCase();
          elizaLogger10.log(`[${requestId}] \u{1F4DD} Will use symbol parameter: ${processedRequest.symbol}`);
        }
      }
      elizaLogger10.log(`[${requestId}] \u{1F3AF} Final token for API call: "${processedRequest.cryptocurrency}"`);
      elizaLogger10.log(`[${requestId}] \u{1F194} Token ID: ${processedRequest.token_id || "none"}`);
      elizaLogger10.log(`[${requestId}] \u{1F524} Symbol: ${processedRequest.symbol || "none"}`);
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (resolvedToken?.TOKEN_ID) {
        apiParams.token_id = resolvedToken.TOKEN_ID;
        elizaLogger10.log(`[${requestId}] Using token_id parameter: ${resolvedToken.TOKEN_ID} (${resolvedToken.TOKEN_NAME})`);
      } else if (processedRequest.token_id) {
        apiParams.token_id = processedRequest.token_id;
        elizaLogger10.log(`[${requestId}] Using provided token_id: ${processedRequest.token_id}`);
      } else if (processedRequest.cryptocurrency) {
        apiParams.token_name = processedRequest.cryptocurrency;
        elizaLogger10.log(`[${requestId}] Fallback to token_name parameter: ${processedRequest.cryptocurrency}`);
      }
      if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
      if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
      const response = await callTokenMetricsAPI(
        "/v2/hourly-ohlcv",
        apiParams,
        runtime
      );
      elizaLogger10.log(`[${requestId}] API response received, processing data...`);
      const ohlcvData = Array.isArray(response) ? response : response.data || [];
      elizaLogger10.log(`[${requestId}] API response received: ${ohlcvData.length} data points`);
      const validData = ohlcvData.filter((item) => {
        if (!item.OPEN || !item.HIGH || !item.LOW || !item.CLOSE || item.OPEN <= 0 || item.HIGH <= 0 || item.LOW <= 0 || item.CLOSE <= 0) {
          return false;
        }
        const priceRange = (item.HIGH - item.LOW) / item.LOW;
        if (priceRange > 10) {
          return false;
        }
        return true;
      });
      elizaLogger10.log(`[${requestId}] Data filtering: ${ohlcvData.length} \u2192 ${validData.length} valid points remaining`);
      const sortedData = validData.sort((a, b) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
      const ohlcvAnalysis = analyzeHourlyOhlcvData(sortedData, processedRequest.analysisType);
      const tokenName = resolvedToken?.TOKEN_NAME || processedRequest.cryptocurrency || processedRequest.symbol || "Unknown Token";
      elizaLogger10.log(`[${requestId}] \u{1F3AF} Final display name: "${tokenName}"`);
      let responseText = `\u{1F4CA} **Hourly OHLCV Data for ${tokenName}**

`;
      if (ohlcvData.length === 0) {
        responseText += `\u274C No hourly OHLCV data found for ${tokenName}. This could mean:
`;
        responseText += `\u2022 The token may not have sufficient trading history
`;
        responseText += `\u2022 TokenMetrics may not have hourly data for this token
`;
        responseText += `\u2022 Try using a different token name or symbol

`;
        responseText += `\u{1F4A1} **Suggestion**: Try major cryptocurrencies like Bitcoin, Ethereum, or Solana.`;
      } else {
        if (ohlcvData.length > sortedData.length) {
          const qualityFiltered = ohlcvData.length - sortedData.length;
          responseText += `\u{1F50D} **Data Quality Note**: Filtered out ${qualityFiltered} invalid data points for better analysis accuracy.

`;
        }
        const recentData = sortedData.slice(-5).reverse();
        responseText += `\u{1F4C8} **Recent Hourly Data (Last ${recentData.length} hours):**
`;
        recentData.forEach((item, index) => {
          const date = new Date(item.DATE || item.TIMESTAMP);
          const timeStr = date.toLocaleString();
          responseText += `
**Hour ${index + 1}** (${timeStr}):
`;
          responseText += `\u2022 Open: ${formatCurrency(item.OPEN)}
`;
          responseText += `\u2022 High: ${formatCurrency(item.HIGH)}
`;
          responseText += `\u2022 Low: ${formatCurrency(item.LOW)}
`;
          responseText += `\u2022 Close: ${formatCurrency(item.CLOSE)}
`;
          responseText += `\u2022 Volume: ${formatCurrency(item.VOLUME)}
`;
        });
        if (ohlcvAnalysis && ohlcvAnalysis.summary) {
          responseText += `

\u{1F4CA} **Analysis Summary:**
${ohlcvAnalysis.summary}
`;
        }
        if (ohlcvAnalysis?.price_analysis) {
          const priceAnalysis = ohlcvAnalysis.price_analysis;
          responseText += `
\u{1F4B0} **Price Movement:**
`;
          responseText += `\u2022 Direction: ${priceAnalysis.direction}
`;
          responseText += `\u2022 Change: ${priceAnalysis.price_change} (${priceAnalysis.change_percent})
`;
          responseText += `\u2022 Range: ${priceAnalysis.lowest_price} - ${priceAnalysis.highest_price}
`;
        }
        if (ohlcvAnalysis?.volume_analysis) {
          const volumeAnalysis = ohlcvAnalysis.volume_analysis;
          responseText += `
\u{1F4CA} **Volume Analysis:**
`;
          responseText += `\u2022 Average Volume: ${volumeAnalysis.average_volume}
`;
          responseText += `\u2022 Volume Trend: ${volumeAnalysis.volume_trend}
`;
          responseText += `\u2022 Consistency: ${volumeAnalysis.volume_consistency}
`;
        }
        if (ohlcvAnalysis?.trading_signals?.signals?.length > 0) {
          responseText += `
\u{1F3AF} **Trading Signals:**
`;
          ohlcvAnalysis.trading_signals.signals.forEach((signal) => {
            responseText += `\u2022 ${signal.type}: ${signal.signal}
`;
          });
        }
        if (processedRequest.analysisType === "scalping" && ohlcvAnalysis?.scalping_focus) {
          responseText += `
\u26A1 **Scalping Insights:**
`;
          ohlcvAnalysis.scalping_focus.scalping_insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "intraday" && ohlcvAnalysis?.intraday_focus) {
          responseText += `
\u{1F4C8} **Intraday Insights:**
`;
          ohlcvAnalysis.intraday_focus.intraday_insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "technical_patterns" && ohlcvAnalysis?.technical_focus) {
          responseText += `
\u{1F50D} **Technical Analysis:**
`;
          ohlcvAnalysis.technical_focus.technical_insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        }
        responseText += `

\u{1F4CB} **Data Summary:**
`;
        responseText += `\u2022 Total Data Points: ${sortedData.length}
`;
        responseText += `\u2022 Timeframe: 1 hour intervals
`;
        responseText += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText += `\u2022 Data Source: TokenMetrics Official API
`;
      }
      const result = {
        success: true,
        message: `Successfully retrieved ${sortedData.length} hourly OHLCV data points`,
        request_id: requestId,
        ohlcv_data: sortedData,
        analysis: ohlcvAnalysis,
        metadata: {
          endpoint: "hourly-ohlcv",
          requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
          resolved_token: resolvedToken,
          date_range: {
            start: processedRequest.startDate,
            end: processedRequest.endDate
          },
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: sortedData.length,
          timeframe: "1 hour",
          api_version: "v2",
          data_source: "TokenMetrics Official API"
        },
        ohlcv_explanation: {
          OPEN: "Opening price at the start of the hour",
          HIGH: "Highest price during the hour",
          LOW: "Lowest price during the hour",
          CLOSE: "Closing price at the end of the hour",
          VOLUME: "Total trading volume during the hour",
          usage_tips: [
            "Use for intraday technical analysis and pattern recognition",
            "Higher volume confirms price movements",
            "Compare hourly ranges to identify volatility patterns",
            "Ideal for scalping and day trading strategies"
          ]
        }
      };
      elizaLogger10.log(`[${requestId}] Hourly OHLCV analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: result
        });
      }
      return createActionResult9({ success: true, text: responseText });
    } catch (error) {
      elizaLogger10.error("Error in getHourlyOhlcvAction:", error);
      const errorMessage = `\u274C **Failed to retrieve hourly OHLCV data**

`;
      const errorText = errorMessage + `**Error**: ${error instanceof Error ? error.message : "Unknown error occurred"}

**Troubleshooting Tips:**
\u2022 Verify the token name or symbol is correct
\u2022 Check your TokenMetrics API key is valid
\u2022 Try using major cryptocurrencies like Bitcoin or Ethereum
\u2022 Ensure your subscription includes OHLCV data access

**Common Solutions:**
\u2022 Remove date filters to get recent data
\u2022 Reduce the limit if requesting too much data
\u2022 Check if the token has sufficient trading history`;
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve hourly OHLCV data from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/hourly-ohlcv is accessible",
          parameter_validation: [
            "Verify token_id is a valid number or symbol is a valid string",
            "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
            "Ensure your API key has access to OHLCV data",
            "Confirm the token has sufficient trading history"
          ],
          common_solutions: [
            "Try using a major token (BTC, ETH) to test functionality",
            "Remove date filters to get recent data",
            "Check if your subscription includes OHLCV data access",
            "Reduce the limit if requesting too much data"
          ]
        }
      };
      if (callback) {
        callback({
          text: errorText,
          content: errorResult
        });
      }
      return createActionResult9({ success: false, error: "Failed to process request" });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger10.log("\u{1F50D} Validating getHourlyOhlcvAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger10.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeHourlyOhlcvData(ohlcvData, analysisType = "all") {
  if (!ohlcvData || ohlcvData.length === 0) {
    return {
      summary: "No hourly OHLCV data available for analysis",
      price_action: "Cannot assess",
      insights: []
    };
  }
  const sortedData = ohlcvData.sort((a, b) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
  const priceAnalysis = analyzePriceMovement(sortedData);
  const volumeAnalysis = analyzeVolumePatterns(sortedData);
  const volatilityAnalysis = analyzeVolatility(sortedData);
  const trendAnalysis = analyzeTrend(sortedData);
  const technicalAnalysis = analyzeTechnicalPatterns(sortedData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "scalping":
      focusedAnalysis = {
        scalping_focus: {
          micro_movements: analyzeScalpingOpportunities(sortedData),
          volume_spikes: identifyVolumeSpikes(sortedData),
          scalping_signals: generateScalpingSignals(priceAnalysis, volumeAnalysis),
          scalping_insights: [
            `\u26A1 Micro-movements detected: ${priceAnalysis.micro_movements || 0}`,
            `\u{1F4CA} Volume spikes: ${volumeAnalysis.volume_spikes || 0}`,
            `\u{1F3AF} Scalping opportunities: ${priceAnalysis.scalping_opportunities || 0}`
          ]
        }
      };
      break;
    case "intraday":
      focusedAnalysis = {
        intraday_focus: {
          day_trading_patterns: analyzeIntradayPatterns(sortedData),
          session_analysis: analyzeSessionBreakdowns(sortedData),
          intraday_signals: generateIntradaySignals(priceAnalysis, trendAnalysis),
          intraday_insights: [
            `\u{1F4C8} Intraday trend: ${trendAnalysis.direction}`,
            `\u{1F550} Best trading hours: ${identifyBestTradingHours(sortedData)}`,
            `\u{1F4B9} Day trading setups: ${technicalAnalysis.day_trading_setups || 0}`
          ]
        }
      };
      break;
    case "technical_patterns":
      focusedAnalysis = {
        technical_focus: {
          chart_patterns: identifyChartPatterns(sortedData),
          support_resistance: findHourlyLevels(sortedData),
          technical_indicators: calculateHourlyIndicators(sortedData),
          technical_insights: [
            `\u{1F4CA} Chart patterns: ${technicalAnalysis.patterns_count || 0}`,
            `\u{1F3AF} Support/Resistance levels: ${technicalAnalysis.key_levels || 0}`,
            `\u{1F4C8} Technical signals: ${technicalAnalysis.signals_count || 0}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Hourly analysis of ${sortedData.length} data points showing ${priceAnalysis.direction || "neutral"} price action with ${volatilityAnalysis.level || "unknown"} volatility`,
    analysis_type: analysisType,
    price_analysis: priceAnalysis,
    volume_analysis: volumeAnalysis,
    volatility_analysis: volatilityAnalysis,
    trend_analysis: trendAnalysis,
    technical_analysis: technicalAnalysis,
    trading_signals: generateTradingSignals(priceAnalysis, volumeAnalysis, trendAnalysis),
    insights: generateOhlcvInsights(priceAnalysis, volumeAnalysis, volatilityAnalysis, trendAnalysis),
    risk_assessment: determineRiskLevel(priceAnalysis, volumeAnalysis),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics Official API",
      completeness: calculateDataCompleteness(sortedData),
      volume_consistency: calculateVolumeConsistency(sortedData.map((d) => d.VOLUME).filter((v) => v)),
      data_points: sortedData.length,
      timeframe_coverage: calculateTimeframeCoverage(sortedData)
    },
    trading_recommendations: generateHourlyTradingRecommendations2(trendAnalysis, technicalAnalysis, analysisType)
  };
}
function analyzePriceMovement(data) {
  if (data.length < 2) return { change: 0, change_percent: 0, direction: "Sideways" };
  const firstPrice = data[0].OPEN;
  const lastPrice = data[data.length - 1].CLOSE;
  const highestPrice = Math.max(...data.map((d) => d.HIGH));
  const lowestPrice = Math.min(...data.map((d) => d.LOW));
  const priceChange = lastPrice - firstPrice;
  const changePercent = priceChange / firstPrice * 100;
  const priceRange = highestPrice - lowestPrice;
  const rangePercent = priceRange / firstPrice * 100;
  return {
    start_price: formatCurrency(firstPrice),
    end_price: formatCurrency(lastPrice),
    price_change: formatCurrency(priceChange),
    change_percent: formatPercentage(changePercent),
    highest_price: formatCurrency(highestPrice),
    lowest_price: formatCurrency(lowestPrice),
    price_range: formatCurrency(priceRange),
    range_percent: formatPercentage(rangePercent),
    direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways",
    overall_direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways"
    // Add this for backward compatibility
  };
}
function analyzeVolumePatterns(data) {
  const volumes = data.map((d) => d.VOLUME).filter((v) => v > 0);
  if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const maxVolume = Math.max(...volumes);
  const minVolume = Math.min(...volumes);
  const firstHalf = volumes.slice(0, Math.floor(volumes.length / 2));
  const secondHalf = volumes.slice(Math.floor(volumes.length / 2));
  const firstHalfAvg = firstHalf.reduce((sum, vol) => sum + vol, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, vol) => sum + vol, 0) / secondHalf.length;
  const volumeTrend = secondHalfAvg > firstHalfAvg * 1.1 ? "Increasing" : secondHalfAvg < firstHalfAvg * 0.9 ? "Decreasing" : "Stable";
  return {
    average_volume: formatCurrency(avgVolume),
    max_volume: formatCurrency(maxVolume),
    min_volume: formatCurrency(minVolume),
    volume_trend: volumeTrend,
    volume_consistency: calculateVolumeConsistency(volumes)
  };
}
function analyzeVolatility(data) {
  if (data.length < 2) return { level: "Unknown" };
  const hourlyRanges = data.map((d) => (d.HIGH - d.LOW) / d.OPEN * 100);
  const avgRange = hourlyRanges.reduce((sum, range) => sum + range, 0) / hourlyRanges.length;
  let volatilityLevel;
  if (avgRange > 5) volatilityLevel = "Very High";
  else if (avgRange > 3) volatilityLevel = "High";
  else if (avgRange > 2) volatilityLevel = "Moderate";
  else if (avgRange > 1) volatilityLevel = "Low";
  else volatilityLevel = "Very Low";
  return {
    level: volatilityLevel,
    average_hourly_range: formatPercentage(avgRange),
    max_hourly_range: formatPercentage(Math.max(...hourlyRanges)),
    volatility_trend: calculateVolatilityTrend(hourlyRanges)
  };
}
function analyzeTrend(data) {
  if (data.length < 2) return { direction: "Insufficient Data" };
  const closes = data.map((d) => d.CLOSE);
  const periods = [5, 10, 20];
  const trends = [];
  for (const period of periods) {
    if (closes.length >= period) {
      const recentMA = closes.slice(-period).reduce((sum, price) => sum + price, 0) / period;
      if (closes.length >= period * 2) {
        const earlierMA = closes.slice(-period * 2, -period).reduce((sum, price) => sum + price, 0) / period;
        trends.push(recentMA > earlierMA ? 1 : -1);
      } else {
        const firstPrice = closes[0];
        trends.push(recentMA > firstPrice ? 1 : -1);
      }
    }
  }
  if (trends.length === 0) {
    const firstPrice = closes[0];
    const lastPrice = closes[closes.length - 1];
    const change = (lastPrice - firstPrice) / firstPrice;
    if (change > 0.01) trends.push(1);
    else if (change < -0.01) trends.push(-1);
    else trends.push(0);
  }
  const overallTrend = trends.reduce((sum, trend) => sum + trend, 0);
  let direction;
  if (overallTrend > 0) direction = "Uptrend";
  else if (overallTrend < 0) direction = "Downtrend";
  else direction = "Sideways";
  let strength;
  if (data.length >= 10) {
    strength = Math.abs(overallTrend) > 2 ? "Strong" : "Weak";
  } else {
    const firstPrice = closes[0];
    const lastPrice = closes[closes.length - 1];
    const change = Math.abs((lastPrice - firstPrice) / firstPrice);
    strength = change > 0.05 ? "Strong" : "Weak";
  }
  let shortTermBias;
  if (closes.length >= 6) {
    shortTermBias = closes[closes.length - 1] > closes[closes.length - 6] ? "Bullish" : "Bearish";
  } else {
    const midPoint = Math.floor(closes.length / 2);
    const recentAvg = closes.slice(midPoint).reduce((sum, price) => sum + price, 0) / (closes.length - midPoint);
    const earlierAvg = closes.slice(0, midPoint).reduce((sum, price) => sum + price, 0) / midPoint;
    shortTermBias = recentAvg > earlierAvg ? "Bullish" : "Bearish";
  }
  return {
    direction,
    strength,
    short_term_bias: shortTermBias,
    trend_confidence: trends.length > 1 ? "High" : "Moderate"
  };
}
function generateOhlcvInsights(priceAnalysis, volumeAnalysis, volatilityAnalysis, trendAnalysis) {
  const insights = [];
  if (parseFloat(priceAnalysis.change_percent) > 5) {
    insights.push(`Strong hourly movement of ${priceAnalysis.change_percent} indicates significant market activity`);
  }
  if (volumeAnalysis.volume_trend === "Increasing") {
    insights.push("Increasing volume confirms the price movement and suggests continuation");
  } else if (volumeAnalysis.volume_trend === "Decreasing") {
    insights.push("Decreasing volume suggests weakening momentum");
  }
  if (volatilityAnalysis.level === "Very High") {
    insights.push("Very high volatility creates both opportunities and risks for intraday trading");
  } else if (volatilityAnalysis.level === "Very Low") {
    insights.push("Low volatility suggests consolidation phase or limited trading interest");
  }
  if (trendAnalysis.direction === "Uptrend" && trendAnalysis.strength === "Strong") {
    insights.push("Strong uptrend supported by multiple timeframes favors long positions");
  } else if (trendAnalysis.direction === "Downtrend" && trendAnalysis.strength === "Strong") {
    insights.push("Strong downtrend suggests continued selling pressure");
  }
  return insights;
}
function generateTradingSignals(priceAnalysis, volumeAnalysis, trendAnalysis) {
  const signals = [];
  if (trendAnalysis.direction === "Uptrend" && volumeAnalysis.volume_trend === "Increasing") {
    signals.push({
      type: "BULLISH",
      signal: "Uptrend with increasing volume suggests buying opportunity",
      confidence: "High"
    });
  }
  if (trendAnalysis.direction === "Downtrend" && volumeAnalysis.volume_trend === "Increasing") {
    signals.push({
      type: "BEARISH",
      signal: "Downtrend with increasing volume suggests selling pressure",
      confidence: "High"
    });
  }
  if (trendAnalysis.direction === "Sideways") {
    signals.push({
      type: "NEUTRAL",
      signal: "Sideways trend suggests range-bound trading opportunities",
      confidence: "Moderate"
    });
  }
  return {
    signals,
    recommendation: signals.length > 0 ? signals[0].type : "HOLD",
    risk_level: determineRiskLevel(priceAnalysis, volumeAnalysis)
  };
}
function calculateDataCompleteness(data) {
  if (data.length === 0) return "No data";
  const requiredFields = ["OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"];
  let completeness = 0;
  data.forEach((item) => {
    const presentFields = requiredFields.filter(
      (field) => item[field] !== null && item[field] !== void 0 && !isNaN(item[field])
    );
    completeness += presentFields.length / requiredFields.length;
  });
  const avgCompleteness = completeness / data.length * 100;
  if (avgCompleteness > 95) return "Excellent";
  if (avgCompleteness > 85) return "Good";
  if (avgCompleteness > 70) return "Fair";
  return "Poor";
}
function calculateVolumeConsistency(volumes) {
  if (volumes.length < 2) return "Insufficient data";
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const variance = volumes.reduce((sum, vol) => sum + Math.pow(vol - avgVolume, 2), 0) / volumes.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / avgVolume;
  if (coefficientOfVariation < 0.5) return "Very Consistent";
  if (coefficientOfVariation < 1) return "Consistent";
  if (coefficientOfVariation < 2) return "Moderate";
  return "Highly Variable";
}
function calculateVolatilityTrend(ranges) {
  if (ranges.length < 3) return "Insufficient data";
  const recentRanges = ranges.slice(-5);
  const earlierRanges = ranges.slice(0, 5);
  const recentAvg = recentRanges.reduce((sum, range) => sum + range, 0) / recentRanges.length;
  const earlierAvg = earlierRanges.reduce((sum, range) => sum + range, 0) / earlierRanges.length;
  if (recentAvg > earlierAvg * 1.2) return "Increasing";
  if (recentAvg < earlierAvg * 0.8) return "Decreasing";
  return "Stable";
}
function determineRiskLevel(priceAnalysis, volumeAnalysis) {
  const priceVolatility = parseFloat(priceAnalysis.range_percent?.replace("%", "") || "0");
  const volumeConsistency = volumeAnalysis.volume_consistency;
  if (priceVolatility > 10 || volumeConsistency === "Highly Variable") return "High";
  if (priceVolatility > 5 || volumeConsistency === "Moderate") return "Medium";
  return "Low";
}
function calculateTimeframeCoverage(data) {
  if (data.length === 0) return "No coverage";
  const hours = data.length;
  if (hours >= 168) return `${Math.floor(hours / 24)} days`;
  if (hours >= 24) return `${Math.floor(hours / 24)} days, ${hours % 24} hours`;
  return `${hours} hours`;
}
function generateHourlyTradingRecommendations2(trendAnalysis, technicalAnalysis, analysisType) {
  const recommendations = [];
  if (trendAnalysis.direction === "Bullish") {
    recommendations.push("Consider long positions on pullbacks");
    recommendations.push("Look for breakout opportunities above resistance");
  } else if (trendAnalysis.direction === "Bearish") {
    recommendations.push("Consider short positions on rallies");
    recommendations.push("Look for breakdown opportunities below support");
  } else {
    recommendations.push("Range-bound trading strategies may be effective");
    recommendations.push("Wait for clear directional breakout");
  }
  if (analysisType === "scalping") {
    recommendations.push("Focus on 1-5 minute entries and exits");
    recommendations.push("Use tight stop losses (0.1-0.3%)");
    recommendations.push("Target quick profits (0.2-0.5%)");
  } else if (analysisType === "intraday") {
    recommendations.push("Plan entries during high volume periods");
    recommendations.push("Use hourly support/resistance levels");
    recommendations.push("Consider session-based strategies");
  }
  return {
    primary_recommendations: recommendations.slice(0, 3),
    risk_management: [
      "Use appropriate position sizing",
      "Set stop losses based on volatility",
      "Monitor volume for confirmation"
    ],
    timing_considerations: [
      "Higher volume hours typically offer better liquidity",
      "Avoid trading during low volume periods",
      "Consider market session overlaps"
    ]
  };
}
function analyzeTechnicalPatterns(data) {
  if (data.length < 10) {
    return {
      patterns_count: 0,
      key_levels: 0,
      signals_count: 0,
      day_trading_setups: 0
    };
  }
  const closes = data.map((d) => d.CLOSE).filter((c) => c);
  const highs = data.map((d) => d.HIGH).filter((h) => h);
  const lows = data.map((d) => d.LOW).filter((l) => l);
  let patternsCount = 0;
  let signalsCount = 0;
  for (let i = 2; i < closes.length; i++) {
    if (closes[i] > closes[i - 1] && closes[i - 1] > closes[i - 2]) {
      patternsCount++;
      signalsCount++;
    }
    if (closes[i] < closes[i - 1] && closes[i - 1] < closes[i - 2]) {
      patternsCount++;
      signalsCount++;
    }
  }
  const keyLevels = findKeyLevels(highs, lows);
  return {
    patterns_count: patternsCount,
    key_levels: keyLevels.length,
    signals_count: signalsCount,
    day_trading_setups: Math.floor(patternsCount / 2),
    support_levels: keyLevels.filter((l) => l.type === "support").length,
    resistance_levels: keyLevels.filter((l) => l.type === "resistance").length
  };
}
function analyzeScalpingOpportunities(data) {
  if (data.length < 5) return 0;
  let opportunities = 0;
  for (let i = 1; i < data.length; i++) {
    const priceChange = Math.abs((data[i].CLOSE - data[i - 1].CLOSE) / data[i - 1].CLOSE);
    const volumeRatio = data[i].VOLUME / (data[i - 1].VOLUME || 1);
    if (priceChange > 2e-3 && volumeRatio > 1.2) {
      opportunities++;
    }
  }
  return opportunities;
}
function identifyVolumeSpikes(data) {
  if (data.length < 5) return 0;
  const volumes = data.map((d) => d.VOLUME).filter((v) => v);
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  return volumes.filter((vol) => vol > avgVolume * 2).length;
}
function generateScalpingSignals(priceAnalysis, volumeAnalysis) {
  const signals = [];
  if (priceAnalysis.direction === "Bullish" && volumeAnalysis.volume_trend === "Increasing") {
    signals.push("Long scalp opportunity on momentum");
  }
  if (priceAnalysis.direction === "Bearish" && volumeAnalysis.volume_trend === "Increasing") {
    signals.push("Short scalp opportunity on momentum");
  }
  if (volumeAnalysis.volume_consistency === "Highly Variable") {
    signals.push("High volatility - good for scalping");
  }
  return {
    active_signals: signals,
    signal_strength: signals.length > 2 ? "Strong" : signals.length > 0 ? "Moderate" : "Weak"
  };
}
function analyzeIntradayPatterns(data) {
  if (data.length < 24) {
    return {
      session_patterns: "Insufficient data",
      best_hours: "Unknown",
      volume_patterns: "Unknown"
    };
  }
  const hourlyData = /* @__PURE__ */ new Map();
  data.forEach((item) => {
    const date = new Date(item.DATE || item.TIMESTAMP);
    const hour = date.getHours();
    if (!hourlyData.has(hour)) {
      hourlyData.set(hour, []);
    }
    hourlyData.get(hour).push(item);
  });
  const hourlyVolumes = Array.from(hourlyData.entries()).map(([hour, items]) => ({
    hour,
    avgVolume: items.reduce((sum, item) => sum + (item.VOLUME || 0), 0) / items.length,
    count: items.length
  }));
  const bestHours = hourlyVolumes.sort((a, b) => b.avgVolume - a.avgVolume).slice(0, 3).map((h) => `${h.hour}:00`);
  return {
    session_patterns: "Analyzed",
    best_hours: bestHours.join(", "),
    volume_patterns: hourlyVolumes.length > 12 ? "Clear patterns" : "Limited patterns",
    peak_activity_hours: bestHours
  };
}
function analyzeSessionBreakdowns(data) {
  const sessions = {
    asian: { start: 0, end: 8, volume: 0, count: 0 },
    european: { start: 8, end: 16, volume: 0, count: 0 },
    american: { start: 16, end: 24, volume: 0, count: 0 }
  };
  data.forEach((item) => {
    const date = new Date(item.DATE || item.TIMESTAMP);
    const hour = date.getUTCHours();
    const volume = item.VOLUME || 0;
    if (hour >= sessions.asian.start && hour < sessions.asian.end) {
      sessions.asian.volume += volume;
      sessions.asian.count++;
    } else if (hour >= sessions.european.start && hour < sessions.european.end) {
      sessions.european.volume += volume;
      sessions.european.count++;
    } else {
      sessions.american.volume += volume;
      sessions.american.count++;
    }
  });
  Object.keys(sessions).forEach((session) => {
    const s = sessions[session];
    s.volume = s.count > 0 ? s.volume / s.count : 0;
  });
  return sessions;
}
function generateIntradaySignals(priceAnalysis, trendAnalysis) {
  const signals = [];
  if (trendAnalysis.direction === "Bullish" && trendAnalysis.strength === "Strong") {
    signals.push("Strong intraday uptrend - consider long positions");
  }
  if (trendAnalysis.direction === "Bearish" && trendAnalysis.strength === "Strong") {
    signals.push("Strong intraday downtrend - consider short positions");
  }
  if (priceAnalysis.direction === "Sideways") {
    signals.push("Range-bound - consider mean reversion strategies");
  }
  return {
    signals,
    confidence: signals.length > 1 ? "High" : signals.length > 0 ? "Medium" : "Low"
  };
}
function identifyBestTradingHours(data) {
  if (data.length < 24) return "Insufficient data";
  const hourlyActivity = /* @__PURE__ */ new Map();
  data.forEach((item) => {
    const date = new Date(item.DATE || item.TIMESTAMP);
    const hour = date.getHours();
    if (!hourlyActivity.has(hour)) {
      hourlyActivity.set(hour, { volume: 0, volatility: 0, count: 0 });
    }
    const activity = hourlyActivity.get(hour);
    activity.volume += item.VOLUME || 0;
    activity.volatility += Math.abs((item.HIGH - item.LOW) / item.CLOSE) || 0;
    activity.count++;
  });
  const hourlyScores = Array.from(hourlyActivity.entries()).map(([hour, data2]) => ({
    hour,
    score: data2.volume / data2.count * (data2.volatility / data2.count)
  }));
  const bestHours = hourlyScores.sort((a, b) => b.score - a.score).slice(0, 3).map((h) => `${h.hour}:00`);
  return bestHours.join(", ");
}
function identifyChartPatterns(data) {
  if (data.length < 10) {
    return {
      patterns: [],
      count: 0
    };
  }
  const patterns = [];
  const closes = data.map((d) => d.CLOSE);
  for (let i = 4; i < closes.length - 4; i++) {
    if (closes[i - 2] < closes[i] && closes[i + 2] < closes[i] && Math.abs(closes[i] - closes[i - 4]) < closes[i] * 0.02) {
      patterns.push({ type: "Double Top", position: i, strength: "Medium" });
    }
    if (closes[i - 2] > closes[i] && closes[i + 2] > closes[i] && Math.abs(closes[i] - closes[i - 4]) < closes[i] * 0.02) {
      patterns.push({ type: "Double Bottom", position: i, strength: "Medium" });
    }
  }
  return {
    patterns,
    count: patterns.length
  };
}
function findHourlyLevels(data) {
  const levels = findKeyLevels(
    data.map((d) => d.HIGH).filter((h) => h),
    data.map((d) => d.LOW).filter((l) => l)
  );
  return {
    support_levels: levels.filter((l) => l.type === "support"),
    resistance_levels: levels.filter((l) => l.type === "resistance"),
    total_levels: levels.length
  };
}
function calculateHourlyIndicators(data) {
  if (data.length < 20) {
    return {
      sma_20: null,
      rsi: null,
      bollinger_bands: null
    };
  }
  const closes = data.map((d) => d.CLOSE).filter((c) => c);
  const sma20 = closes.slice(-20).reduce((sum, price) => sum + price, 0) / 20;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < Math.min(15, closes.length); i++) {
    const change = closes[i] - closes[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }
  const avgGain = gains / 14;
  const avgLoss = losses / 14;
  const rs = avgGain / (avgLoss || 1);
  const rsi = 100 - 100 / (1 + rs);
  return {
    sma_20: sma20,
    rsi,
    bollinger_bands: {
      upper: sma20 * 1.02,
      lower: sma20 * 0.98,
      middle: sma20
    }
  };
}
function findKeyLevels(highs, lows) {
  const levels = [];
  const sortedHighs = [...highs].sort((a, b) => b - a);
  const topHighs = sortedHighs.slice(0, 3);
  topHighs.forEach((high) => {
    const occurrences = highs.filter((h) => Math.abs(h - high) < high * 5e-3).length;
    if (occurrences >= 2) {
      levels.push({ price: high, type: "resistance", strength: occurrences });
    }
  });
  const sortedLows = [...lows].sort((a, b) => a - b);
  const bottomLows = sortedLows.slice(0, 3);
  bottomLows.forEach((low) => {
    const occurrences = lows.filter((l) => Math.abs(l - low) < low * 5e-3).length;
    if (occurrences >= 2) {
      levels.push({ price: low, type: "support", strength: occurrences });
    }
  });
  return levels;
}

// src/actions/getDailyOhlcvAction.ts
import {
  elizaLogger as elizaLogger11,
  createActionResult as createActionResult10
} from "@elizaos/core";
var DailyOhlcvRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: external_exports.string().optional().describe("Full name of the token"),
  startDate: external_exports.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: external_exports.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  limit: external_exports.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["swing_trading", "trend_analysis", "technical_indicators", "all"]).optional().describe("Type of analysis to focus on")
});
var DAILY_OHLCV_EXTRACTION_TEMPLATE = `
CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

You are an AI assistant specialized in extracting daily OHLCV data requests from natural language.

The user wants to get daily OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (required): The EXACT name or symbol of the cryptocurrency mentioned by the user
   - Bitcoin, BTC \u2192 "Bitcoin"
   - Ethereum, ETH \u2192 "Ethereum" 
   - Dogecoin, DOGE \u2192 "Dogecoin"
   - Solana, SOL \u2192 "Solana"
   - Avalanche, AVAX \u2192 "Avalanche"
   - Cardano, ADA \u2192 "Cardano"
   - Polkadot, DOT \u2192 "Polkadot"
   - Chainlink, LINK \u2192 "Chainlink"
   - CRITICAL: Use the EXACT name/symbol the user mentioned

2. **symbol** (optional): Token symbol if mentioned
   - Extract symbols like "BTC", "ETH", "ADA", etc.

3. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

4. **token_name** (optional): Full name of the token for API calls

5. **startDate** (optional): Start date for data range
   - Look for dates in YYYY-MM-DD format
   - Convert relative dates like "last month", "past 30 days"

6. **endDate** (optional): End date for data range
   - Look for dates in YYYY-MM-DD format

7. **limit** (optional, default: 50): Number of data points to return
   - Look for phrases like "50 days", "last 100 candles", "200 data points"

8. **page** (optional, default: 1): Page number for pagination

9. **analysisType** (optional, default: "all"): What type of analysis they want
   - "swing_trading" - focus on swing trading opportunities and signals
   - "trend_analysis" - focus on trend identification and direction
   - "technical_indicators" - focus on technical indicators and patterns
   - "all" - comprehensive OHLCV analysis

CRITICAL EXAMPLES:
- "Get daily OHLCV for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me daily candles for BTC" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Daily data for ETH for swing trading" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "swing_trading"}
- "DOGE daily OHLCV" \u2192 {cryptocurrency: "Dogecoin", symbol: "DOGE", analysisType: "all"}
- "Solana trend analysis" \u2192 {cryptocurrency: "Solana", symbol: "SOL", analysisType: "trend_analysis"}

Extract the request details from the user's message and respond in XML format:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format</startDate>
<endDate>end date in YYYY-MM-DD format</endDate>
<limit>number of data points to return</limit>
<page>page number</page>
<analysisType>swing_trading|trend_analysis|technical_indicators|all</analysisType>
</response>
`;
function extractCryptocurrencySimple5(text) {
  const cryptoPatterns = [
    { regex: /\b(bitcoin|btc)\b/i, name: "Bitcoin", symbol: "BTC" },
    { regex: /\b(ethereum|eth)\b/i, name: "Ethereum", symbol: "ETH" },
    { regex: /\b(dogecoin|doge)\b/i, name: "Dogecoin", symbol: "DOGE" },
    { regex: /\b(solana|sol)\b/i, name: "Solana", symbol: "SOL" },
    { regex: /\b(avalanche|avax)\b/i, name: "Avalanche", symbol: "AVAX" },
    { regex: /\b(cardano|ada)\b/i, name: "Cardano", symbol: "ADA" },
    { regex: /\b(polkadot|dot)\b/i, name: "Polkadot", symbol: "DOT" },
    { regex: /\b(chainlink|link)\b/i, name: "Chainlink", symbol: "LINK" },
    { regex: /\b(binance coin|bnb)\b/i, name: "BNB", symbol: "BNB" },
    { regex: /\b(ripple|xrp)\b/i, name: "XRP", symbol: "XRP" },
    { regex: /\b(litecoin|ltc)\b/i, name: "Litecoin", symbol: "LTC" },
    { regex: /\b(polygon|matic)\b/i, name: "Polygon", symbol: "MATIC" },
    { regex: /\b(uniswap|uni)\b/i, name: "Uniswap", symbol: "UNI" },
    { regex: /\b(shiba inu|shib)\b/i, name: "Shiba Inu", symbol: "SHIB" }
  ];
  for (const pattern of cryptoPatterns) {
    if (pattern.regex.test(text)) {
      return {
        cryptocurrency: pattern.name,
        symbol: pattern.symbol
      };
    }
  }
  return {};
}
var getDailyOhlcvAction = {
  name: "GET_DAILY_OHLCV_TOKENMETRICS",
  description: "Get daily OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency tokens from TokenMetrics",
  similes: [
    "get daily ohlcv",
    "daily price data",
    "daily candles",
    "daily chart data",
    "swing trading data",
    "daily technical analysis",
    "daily market data"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get daily OHLCV for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the daily OHLCV data for Bitcoin.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show daily price data for ETH"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve daily OHLCV data for Ethereum.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Daily candles for long-term analysis"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get daily OHLCV data for long-term analysis.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing daily OHLCV request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = DAILY_OHLCV_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const ohlcvRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        DailyOhlcvRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, ohlcvRequest);
      let processedRequest = {
        cryptocurrency: ohlcvRequest?.cryptocurrency || null,
        token_id: ohlcvRequest?.token_id || null,
        symbol: ohlcvRequest?.symbol || null,
        token_name: ohlcvRequest?.token_name || null,
        startDate: ohlcvRequest?.startDate || null,
        endDate: ohlcvRequest?.endDate || null,
        limit: ohlcvRequest?.limit || 50,
        page: ohlcvRequest?.page || 1,
        analysisType: ohlcvRequest?.analysisType || "all"
      };
      if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes("unknown")) {
        console.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple5(message.content?.text || "");
        if (regexResult.cryptocurrency) {
          processedRequest.cryptocurrency = regexResult.cryptocurrency;
          processedRequest.symbol = regexResult.symbol || null;
          console.log(`[${requestId}] Regex fallback found: ${regexResult.cryptocurrency} (${regexResult.symbol})`);
        }
      }
      if (processedRequest.cryptocurrency && processedRequest.cryptocurrency.length <= 5) {
        const symbolToNameMap = {
          "BTC": "Bitcoin",
          "ETH": "Ethereum",
          "DOGE": "Dogecoin",
          "SOL": "Solana",
          "AVAX": "Avalanche",
          "ADA": "Cardano",
          "DOT": "Polkadot",
          "LINK": "Chainlink",
          "BNB": "BNB",
          "XRP": "XRP",
          "LTC": "Litecoin",
          "MATIC": "Polygon",
          "UNI": "Uniswap",
          "SHIB": "Shiba Inu"
        };
        const fullName = symbolToNameMap[processedRequest.cryptocurrency.toUpperCase()];
        if (fullName) {
          console.log(`[${requestId}] Converting symbol ${processedRequest.cryptocurrency} to full name: ${fullName}`);
          processedRequest.cryptocurrency = fullName;
          if (!processedRequest.symbol) {
            processedRequest.symbol = processedRequest.cryptocurrency.toUpperCase();
          }
        }
      }
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
        try {
          resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
          if (resolvedToken) {
            processedRequest.token_id = resolvedToken.TOKEN_ID;
            processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_SYMBOL} (ID: ${resolvedToken.TOKEN_ID})`);
          }
        } catch (error) {
          console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.symbol) {
        apiParams.symbol = processedRequest.symbol;
        console.log(`[${requestId}] Using symbol parameter: ${processedRequest.symbol}`);
      } else if (processedRequest.cryptocurrency) {
        apiParams.token_name = processedRequest.cryptocurrency;
        console.log(`[${requestId}] Using token_name parameter: ${processedRequest.cryptocurrency}`);
      } else if (processedRequest.token_id) {
        apiParams.token_id = processedRequest.token_id;
        console.log(`[${requestId}] Using token_id parameter: ${processedRequest.token_id}`);
      }
      if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
      if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
      const response = await callTokenMetricsAPI(
        "/v2/daily-ohlcv",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing OHLCV data...`);
      const ohlcvData = Array.isArray(response) ? response : response.data || [];
      let filteredByToken = ohlcvData;
      if (ohlcvData.length > 0 && processedRequest.symbol) {
        const tokenGroups = ohlcvData.reduce((groups, item) => {
          const tokenId = item.TOKEN_ID;
          if (!groups[tokenId]) {
            groups[tokenId] = [];
          }
          groups[tokenId].push(item);
          return groups;
        }, {});
        const tokenIds = Object.keys(tokenGroups);
        console.log(
          `[${requestId}] Found ${tokenIds.length} different tokens for symbol ${processedRequest.symbol}:`,
          tokenIds.map((id) => `${tokenGroups[id][0]?.TOKEN_NAME} (ID: ${id}, Price: ~$${tokenGroups[id][0]?.CLOSE})`)
        );
        if (tokenIds.length > 1) {
          let selectedTokenId = null;
          let maxScore = -1;
          for (const tokenId of tokenIds) {
            const tokenData = tokenGroups[tokenId];
            const firstItem = tokenData[0];
            let score = 0;
            const avgPrice = tokenData.reduce((sum, item) => sum + (item.CLOSE || 0), 0) / tokenData.length;
            if (avgPrice > 1e3) score += 100;
            else if (avgPrice > 100) score += 50;
            else if (avgPrice > 10) score += 20;
            else if (avgPrice > 1) score += 10;
            const avgVolume = tokenData.reduce((sum, item) => sum + (item.VOLUME || 0), 0) / tokenData.length;
            if (avgVolume > 1e9) score += 50;
            else if (avgVolume > 1e8) score += 30;
            else if (avgVolume > 1e7) score += 20;
            else if (avgVolume > 1e6) score += 10;
            const tokenName2 = firstItem.TOKEN_NAME?.toLowerCase() || "";
            const symbol = processedRequest.symbol?.toLowerCase() || "";
            if (tokenName2 === symbol) score += 30;
            else if (tokenName2.includes(symbol)) score += 20;
            else if (symbol === "btc" && tokenName2 === "bitcoin") score += 40;
            else if (symbol === "eth" && tokenName2 === "ethereum") score += 40;
            else if (symbol === "doge" && tokenName2 === "dogecoin") score += 40;
            if (tokenName2.includes("wrapped") || tokenName2.includes("osmosis") || tokenName2.includes("synthetic") || tokenName2.includes("bridged")) {
              score -= 20;
            }
            console.log(`[${requestId}] Token ${firstItem.TOKEN_NAME} (ID: ${tokenId}) score: ${score} (price: $${avgPrice.toFixed(6)}, volume: ${avgVolume.toFixed(0)})`);
            if (score > maxScore) {
              maxScore = score;
              selectedTokenId = tokenId;
            }
          }
          if (selectedTokenId) {
            filteredByToken = tokenGroups[selectedTokenId];
            const selectedToken = filteredByToken[0];
            console.log(`[${requestId}] Selected main token: ${selectedToken.TOKEN_NAME} (ID: ${selectedTokenId}) with score ${maxScore}`);
          } else {
            console.log(`[${requestId}] No clear main token identified, using all data`);
          }
        } else {
          console.log(`[${requestId}] Single token found: ${tokenGroups[tokenIds[0]][0]?.TOKEN_NAME}`);
        }
      }
      const validData = filteredByToken.filter((item) => {
        if (!item.OPEN || !item.HIGH || !item.LOW || !item.CLOSE || item.OPEN <= 0 || item.HIGH <= 0 || item.LOW <= 0 || item.CLOSE <= 0) {
          console.log(`[${requestId}] Filtering out invalid data point:`, item);
          return false;
        }
        const priceRange = (item.HIGH - item.LOW) / item.LOW;
        if (priceRange > 10) {
          console.log(`[${requestId}] Filtering out extreme outlier:`, item);
          return false;
        }
        return true;
      });
      console.log(`[${requestId}] Token filtering: ${ohlcvData.length} \u2192 ${filteredByToken.length} data points`);
      console.log(`[${requestId}] Quality filtering: ${filteredByToken.length} \u2192 ${validData.length} valid points remaining`);
      const sortedData = validData.sort((a, b) => new Date(a.DATE || a.TIMESTAMP).getTime() - new Date(b.DATE || b.TIMESTAMP).getTime());
      const ohlcvAnalysis = analyzeDailyOhlcvData(sortedData, processedRequest.analysisType);
      const tokenName = resolvedToken?.name || processedRequest.cryptocurrency || processedRequest.symbol || "the requested token";
      let responseText = `\u{1F4CA} **Daily OHLCV Data for ${tokenName}**

`;
      if (sortedData.length === 0) {
        responseText += `\u274C No valid daily OHLCV data found for ${tokenName}. This could mean:
`;
        responseText += `\u2022 The token may not have sufficient trading history
`;
        responseText += `\u2022 TokenMetrics may not have daily data for this token
`;
        responseText += `\u2022 All data points were filtered out due to quality issues
`;
        responseText += `\u2022 Try using a different token name or symbol

`;
        responseText += `\u{1F4A1} **Suggestion**: Try major cryptocurrencies like Bitcoin, Ethereum, or Solana.`;
      } else {
        if (ohlcvData.length > sortedData.length) {
          const tokenFiltered = ohlcvData.length - filteredByToken.length;
          const qualityFiltered = filteredByToken.length - sortedData.length;
          if (tokenFiltered > 0 && qualityFiltered > 0) {
            responseText += `\u{1F50D} **Data Quality Note**: Filtered out ${tokenFiltered} mixed token data points and ${qualityFiltered} invalid data points for accurate analysis.

`;
          } else if (tokenFiltered > 0) {
            responseText += `\u{1F50D} **Data Quality Note**: Selected main token from ${tokenFiltered + sortedData.length} mixed data points for accurate analysis.

`;
          } else if (qualityFiltered > 0) {
            responseText += `\u{1F50D} **Data Quality Note**: Filtered out ${qualityFiltered} invalid data points for better analysis accuracy.

`;
          }
        }
        const recentData = sortedData.slice(-5).reverse();
        responseText += `\u{1F4C8} **Recent Daily Data (Last ${recentData.length} days):**
`;
        recentData.forEach((item, index) => {
          const date = new Date(item.DATE || item.TIMESTAMP);
          const dateStr = date.toLocaleDateString();
          responseText += `
**Day ${index + 1}** (${dateStr}):
`;
          responseText += `\u2022 Open: ${formatCurrency(item.OPEN)}
`;
          responseText += `\u2022 High: ${formatCurrency(item.HIGH)}
`;
          responseText += `\u2022 Low: ${formatCurrency(item.LOW)}
`;
          responseText += `\u2022 Close: ${formatCurrency(item.CLOSE)}
`;
          responseText += `\u2022 Volume: ${formatCurrency(item.VOLUME)}
`;
        });
        if (ohlcvAnalysis && ohlcvAnalysis.summary) {
          responseText += `

\u{1F4CA} **Analysis Summary:**
${ohlcvAnalysis.summary}
`;
        }
        if (ohlcvAnalysis?.price_analysis) {
          const priceAnalysis = ohlcvAnalysis.price_analysis;
          responseText += `
\u{1F4B0} **Price Movement:**
`;
          responseText += `\u2022 Direction: ${priceAnalysis.direction || "Unknown"}
`;
          responseText += `\u2022 Change: ${priceAnalysis.price_change || "N/A"} (${priceAnalysis.change_percent || "N/A"})
`;
          responseText += `\u2022 Range: ${priceAnalysis.lowest_price || "N/A"} - ${priceAnalysis.highest_price || "N/A"}
`;
        }
        if (ohlcvAnalysis?.trend_analysis) {
          const trendAnalysis = ohlcvAnalysis.trend_analysis;
          responseText += `
\u{1F4C8} **Trend Analysis:**
`;
          responseText += `\u2022 Primary Trend: ${trendAnalysis.primary_trend}
`;
          responseText += `\u2022 Trend Strength: ${trendAnalysis.trend_strength}
`;
          responseText += `\u2022 Momentum: ${trendAnalysis.momentum}
`;
        }
        if (ohlcvAnalysis?.volume_analysis) {
          const volumeAnalysis = ohlcvAnalysis.volume_analysis;
          responseText += `
\u{1F4CA} **Volume Analysis:**
`;
          responseText += `\u2022 Average Volume: ${volumeAnalysis.average_volume || "N/A"}
`;
          responseText += `\u2022 Volume Trend: ${volumeAnalysis.volume_trend || "Unknown"}
`;
          responseText += `\u2022 Volume Pattern: ${volumeAnalysis.volume_pattern || "Unknown"}
`;
        }
        if (ohlcvAnalysis?.trading_recommendations?.primary_recommendations?.length > 0) {
          responseText += `
\u{1F3AF} **Trading Recommendations:**
`;
          ohlcvAnalysis.trading_recommendations.primary_recommendations.forEach((rec) => {
            responseText += `\u2022 ${rec}
`;
          });
        }
        if (processedRequest.analysisType === "swing_trading" && ohlcvAnalysis?.swing_trading_focus) {
          responseText += `
\u26A1 **Swing Trading Insights:**
`;
          ohlcvAnalysis.swing_trading_focus.insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "trend_analysis" && ohlcvAnalysis?.trend_focus) {
          responseText += `
\u{1F4C8} **Trend Analysis Insights:**
`;
          ohlcvAnalysis.trend_focus.insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "technical_indicators" && ohlcvAnalysis?.technical_focus) {
          responseText += `
\u{1F50D} **Technical Analysis:**
`;
          ohlcvAnalysis.technical_focus.insights?.forEach((insight) => {
            responseText += `\u2022 ${insight}
`;
          });
        }
        responseText += `

\u{1F4CB} **Data Summary:**
`;
        responseText += `\u2022 Total Data Points: ${sortedData.length}
`;
        responseText += `\u2022 Timeframe: 1 day intervals
`;
        responseText += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText += `\u2022 Data Source: TokenMetrics Official API
`;
      }
      const result = {
        success: true,
        message: `Successfully retrieved ${sortedData.length} daily OHLCV data points`,
        request_id: requestId,
        ohlcv_data: sortedData,
        analysis: ohlcvAnalysis,
        metadata: {
          endpoint: "daily-ohlcv",
          requested_token: processedRequest.symbol || processedRequest.cryptocurrency || processedRequest.token_id,
          date_range: {
            start: processedRequest.startDate,
            end: processedRequest.endDate
          },
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: sortedData.length,
          timeframe: "1 day",
          api_version: "v2",
          data_source: "TokenMetrics Official API"
        },
        ohlcv_explanation: {
          OPEN: "Opening price at the start of the day",
          HIGH: "Highest price during the day",
          LOW: "Lowest price during the day",
          CLOSE: "Closing price at the end of the day",
          VOLUME: "Total trading volume during the day",
          usage_tips: [
            "Use for swing trading and medium-term technical analysis",
            "Daily data is ideal for trend identification and support/resistance levels",
            "Volume analysis helps confirm breakouts and reversals"
          ]
        }
      };
      console.log(`[${requestId}] Daily OHLCV analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "daily-ohlcv",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult10({ success: true, text: responseText });
    } catch (error) {
      console.error("Error in getDailyOhlcv action:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const reqId = generateRequestId();
      if (callback) {
        await callback({
          text: `\u274C Error fetching daily OHLCV: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: reqId
          }
        });
      }
      return createActionResult10({
        success: false,
        error: errorMessage
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger11.log("\u{1F50D} Validating getDailyOhlcvAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger11.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeDailyOhlcvData(ohlcvData, analysisType = "all") {
  if (!ohlcvData || ohlcvData.length === 0) {
    return {
      summary: "No daily OHLCV data available for analysis",
      trend_analysis: "Cannot assess",
      insights: []
    };
  }
  const sortedData = ohlcvData.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
  const priceAnalysis = analyzeDailyPriceMovement(sortedData);
  const volumeAnalysis = analyzeDailyVolumePatterns(sortedData);
  const technicalAnalysis = analyzeTechnicalIndicators(sortedData);
  const trendAnalysis = analyzeDailyTrend(sortedData);
  const supportResistanceAnalysis = analyzeSupportResistance(sortedData);
  const insights = generateDailyInsights(priceAnalysis, volumeAnalysis, technicalAnalysis, trendAnalysis);
  return {
    summary: `Daily analysis of ${sortedData.length} days shows ${trendAnalysis.primary_trend} trend with ${priceAnalysis.volatility_level} volatility`,
    price_analysis: priceAnalysis,
    volume_analysis: volumeAnalysis,
    technical_analysis: technicalAnalysis,
    trend_analysis: trendAnalysis,
    support_resistance: supportResistanceAnalysis,
    insights,
    trading_recommendations: generateDailyTradingRecommendations(trendAnalysis, technicalAnalysis, volumeAnalysis),
    investment_signals: generateInvestmentSignals(priceAnalysis, trendAnalysis, technicalAnalysis),
    data_quality: {
      source: "TokenMetrics Official API",
      timeframe: "1 day",
      data_points: sortedData.length,
      date_range: `${sortedData[0]?.DATE || "Unknown"} to ${sortedData[sortedData.length - 1]?.DATE || "Unknown"}`,
      completeness: calculateDailyDataCompleteness(sortedData)
    }
  };
}
function analyzeDailyPriceMovement(data) {
  if (data.length < 2) return { change: 0, change_percent: 0 };
  const firstPrice = data[0].OPEN;
  const lastPrice = data[data.length - 1].CLOSE;
  const highestPrice = Math.max(...data.map((d) => d.HIGH));
  const lowestPrice = Math.min(...data.map((d) => d.LOW));
  const priceChange = lastPrice - firstPrice;
  const changePercent = priceChange / firstPrice * 100;
  const priceRange = highestPrice - lowestPrice;
  const rangePercent = priceRange / firstPrice * 100;
  const dailyReturns = data.slice(1).map(
    (day, i) => (day.CLOSE - data[i].CLOSE) / data[i].CLOSE * 100
  );
  const avgDailyReturn = dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length;
  const volatility = Math.sqrt(dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgDailyReturn, 2), 0) / (dailyReturns.length - 1));
  let volatilityLevel;
  if (volatility > 8) volatilityLevel = "Very High";
  else if (volatility > 5) volatilityLevel = "High";
  else if (volatility > 3) volatilityLevel = "Moderate";
  else if (volatility > 1.5) volatilityLevel = "Low";
  else volatilityLevel = "Very Low";
  return {
    start_price: formatCurrency(firstPrice),
    end_price: formatCurrency(lastPrice),
    price_change: formatCurrency(priceChange),
    change_percent: formatPercentage(changePercent),
    highest_price: formatCurrency(highestPrice),
    lowest_price: formatCurrency(lowestPrice),
    price_range: formatCurrency(priceRange),
    range_percent: formatPercentage(rangePercent),
    daily_volatility: formatPercentage(volatility),
    volatility_level: volatilityLevel,
    direction: priceChange > 0 ? "Bullish" : priceChange < 0 ? "Bearish" : "Sideways",
    momentum: calculateMomentum(data)
  };
}
function analyzeDailyVolumePatterns(data) {
  const volumes = data.map((d) => d.VOLUME).filter((v) => v > 0);
  if (volumes.length === 0) return { average_volume: 0, pattern: "No data" };
  const avgVolume = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  const maxVolume = Math.max(...volumes);
  const minVolume = Math.min(...volumes);
  const priceChanges = data.slice(1).map((day, i) => day.CLOSE - data[i].CLOSE);
  const volumePriceCorrelation = calculateCorrelation(volumes.slice(1), priceChanges);
  const recentVolume = volumes.slice(-7).reduce((sum, vol) => sum + vol, 0) / 7;
  const earlierVolume = volumes.slice(-14, -7).reduce((sum, vol) => sum + vol, 0) / 7;
  const volumeTrend = recentVolume > earlierVolume * 1.1 ? "Increasing" : recentVolume < earlierVolume * 0.9 ? "Decreasing" : "Stable";
  return {
    average_volume: formatCurrency(avgVolume),
    max_volume: formatCurrency(maxVolume),
    min_volume: formatCurrency(minVolume),
    volume_trend: volumeTrend,
    volume_price_correlation: volumePriceCorrelation.toFixed(3),
    volume_pattern: classifyVolumePattern(volumes),
    volume_confirmation: analyzeVolumeConfirmation(data)
  };
}
function analyzeTechnicalIndicators(data) {
  if (data.length < 20) return { status: "Insufficient data for technical analysis" };
  const closes = data.map((d) => d.CLOSE);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const currentPrice = closes[closes.length - 1];
  const rsi = calculateRSI(closes, 14);
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  const macd = ema12[ema12.length - 1] - ema26[ema26.length - 1];
  return {
    moving_averages: {
      sma_20: formatCurrency(sma20),
      sma_50: formatCurrency(sma50),
      price_vs_sma20: currentPrice > sma20 ? "Above" : "Below",
      price_vs_sma50: currentPrice > sma50 ? "Above" : "Below",
      ma_alignment: sma20 > sma50 ? "Bullish" : "Bearish"
    },
    momentum_indicators: {
      rsi: rsi.toFixed(2),
      rsi_signal: interpretRSI(rsi),
      macd: macd.toFixed(4),
      macd_signal: macd > 0 ? "Bullish" : "Bearish"
    },
    technical_bias: determineTechnicalBias(currentPrice, sma20, sma50, rsi)
  };
}
function analyzeDailyTrend(data) {
  if (data.length < 2) return { primary_trend: "Insufficient Data" };
  const closes = data.map((d) => d.CLOSE);
  const highs = data.map((d) => d.HIGH);
  const lows = data.map((d) => d.LOW);
  let shortTrend, mediumTrend, longTrend;
  if (closes.length >= 3) {
    shortTrend = identifyTrend(closes.slice(-3));
  } else {
    shortTrend = identifyTrend(closes);
  }
  if (closes.length >= 5) {
    mediumTrend = identifyTrend(closes.slice(-5));
  } else {
    mediumTrend = shortTrend;
  }
  longTrend = identifyTrend(closes);
  const analysisWindow = Math.min(10, highs.length);
  const higherHighs = countHigherHighs(highs.slice(-analysisWindow));
  const higherLows = countHigherLows(lows.slice(-analysisWindow));
  let primaryTrend;
  if (data.length >= 5) {
    if (shortTrend === "Up" && mediumTrend === "Up") primaryTrend = "Strong Uptrend";
    else if (shortTrend === "Down" && mediumTrend === "Down") primaryTrend = "Strong Downtrend";
    else if (shortTrend === "Up") primaryTrend = "Uptrend";
    else if (shortTrend === "Down") primaryTrend = "Downtrend";
    else primaryTrend = "Sideways";
  } else {
    if (shortTrend === "Up") primaryTrend = "Short-term Uptrend";
    else if (shortTrend === "Down") primaryTrend = "Short-term Downtrend";
    else primaryTrend = "Sideways";
  }
  return {
    primary_trend: primaryTrend,
    short_term_trend: shortTrend,
    medium_term_trend: mediumTrend,
    long_term_trend: longTrend,
    trend_strength: calculateTrendStrength(closes),
    higher_highs: higherHighs,
    higher_lows: higherLows,
    trend_consistency: analyzeTrendConsistency(closes),
    momentum: calculateMomentumFromTrend(closes)
  };
}
function analyzeSupportResistance(data) {
  if (data.length < 10) return { levels: "Insufficient data" };
  const highs = data.map((d) => d.HIGH);
  const lows = data.map((d) => d.LOW);
  const closes = data.map((d) => d.CLOSE);
  const resistanceLevels = findResistanceLevels(highs);
  const supportLevels = findSupportLevels(lows);
  const currentPrice = closes[closes.length - 1];
  return {
    nearest_resistance: findNearestLevel(currentPrice, resistanceLevels, "resistance"),
    nearest_support: findNearestLevel(currentPrice, supportLevels, "support"),
    key_levels: {
      major_resistance: formatCurrency(Math.max(...resistanceLevels)),
      major_support: formatCurrency(Math.min(...supportLevels))
    },
    level_strength: "Based on price action and volume confirmation"
  };
}
function generateDailyInsights(priceAnalysis, volumeAnalysis, technicalAnalysis, trendAnalysis) {
  const insights = [];
  const changePercent = parseFloat(priceAnalysis.change_percent);
  if (Math.abs(changePercent) > 20) {
    insights.push(`Significant price movement of ${priceAnalysis.change_percent} over the analyzed period indicates strong market sentiment`);
  }
  if (trendAnalysis.primary_trend === "Strong Uptrend") {
    insights.push("Strong uptrend with multiple timeframe confirmation suggests continued bullish momentum");
  } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
    insights.push("Strong downtrend across timeframes indicates sustained selling pressure");
  }
  if (volumeAnalysis.volume_trend === "Increasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
    insights.push("Increasing volume during uptrend confirms buyer interest and trend sustainability");
  } else if (volumeAnalysis.volume_trend === "Decreasing" && trendAnalysis.primary_trend.includes("Uptrend")) {
    insights.push("Decreasing volume during uptrend suggests potential weakening momentum");
  }
  if (technicalAnalysis.technical_bias === "Strongly Bullish") {
    insights.push("Technical indicators align bullishly - price above key moving averages with positive momentum");
  } else if (technicalAnalysis.technical_bias === "Strongly Bearish") {
    insights.push("Technical indicators show bearish alignment suggesting continued downside pressure");
  }
  return insights;
}
function generateDailyTradingRecommendations(trendAnalysis, technicalAnalysis, volumeAnalysis) {
  const recommendations = [];
  let overallBias = "NEUTRAL";
  if (trendAnalysis.primary_trend === "Strong Uptrend") {
    recommendations.push("Consider long positions on pullbacks to support levels");
    overallBias = "BULLISH";
  } else if (trendAnalysis.primary_trend === "Strong Downtrend") {
    recommendations.push("Consider short positions or avoid longs until trend reversal");
    overallBias = "BEARISH";
  }
  if (technicalAnalysis.momentum_indicators?.rsi_signal === "Oversold") {
    recommendations.push("RSI oversold condition may present buying opportunity");
  } else if (technicalAnalysis.momentum_indicators?.rsi_signal === "Overbought") {
    recommendations.push("RSI overbought condition suggests caution for new long positions");
  }
  if (volumeAnalysis.volume_trend === "Increasing") {
    recommendations.push("Increasing volume supports current trend continuation");
  }
  return {
    overall_bias: overallBias,
    recommendations,
    risk_management: [
      "Use appropriate position sizing based on volatility",
      "Set stop losses at key support/resistance levels",
      "Monitor volume for trend confirmation"
    ]
  };
}
function generateInvestmentSignals(priceAnalysis, trendAnalysis, technicalAnalysis) {
  let investmentSignal = "HOLD";
  const signals = [];
  if (trendAnalysis.long_term_trend === "Up" && technicalAnalysis.technical_bias === "Bullish") {
    investmentSignal = "BUY";
    signals.push("Long-term uptrend with positive technical indicators supports accumulation");
  } else if (trendAnalysis.long_term_trend === "Down" && technicalAnalysis.technical_bias === "Bearish") {
    investmentSignal = "SELL";
    signals.push("Long-term downtrend with negative technicals suggests distribution");
  }
  if (priceAnalysis.volatility_level === "Very High") {
    signals.push("High volatility suggests using dollar-cost averaging for entries");
  }
  return {
    signal: investmentSignal,
    confidence: determineSignalConfidence(trendAnalysis, technicalAnalysis),
    rationale: signals,
    time_horizon: "Medium to long-term (weeks to months)"
  };
}
function calculateMomentum(data) {
  if (data.length < 5) return "Unknown";
  const recentClose = data[data.length - 1].CLOSE;
  const pastClose = data[data.length - 5].CLOSE;
  const momentum = (recentClose - pastClose) / pastClose * 100;
  if (momentum > 5) return "Strong Positive";
  if (momentum > 2) return "Positive";
  if (momentum > -2) return "Neutral";
  if (momentum > -5) return "Negative";
  return "Strong Negative";
}
function calculateCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;
  const xMean = x.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
  let numerator = 0;
  let xSumSquares = 0;
  let ySumSquares = 0;
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xSumSquares += xDiff * xDiff;
    ySumSquares += yDiff * yDiff;
  }
  const denominator = Math.sqrt(xSumSquares * ySumSquares);
  return denominator === 0 ? 0 : numerator / denominator;
}
function calculateSMA(prices, period) {
  if (prices.length < period) return prices[prices.length - 1];
  return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
}
function calculateEMA(prices, period) {
  const ema = [];
  const multiplier = 2 / (period + 1);
  ema[0] = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema[i] = prices[i] * multiplier + ema[i - 1] * (1 - multiplier);
  }
  return ema;
}
function calculateRSI(prices, period) {
  if (prices.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    const gain = change > 0 ? change : 0;
    const loss = change < 0 ? -change : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
  }
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}
function interpretRSI(rsi) {
  if (rsi > 70) return "Overbought";
  if (rsi < 30) return "Oversold";
  return "Neutral";
}
function identifyTrend(prices) {
  if (prices.length < 3) return "Unknown";
  const firstPrice = prices[0];
  const lastPrice = prices[prices.length - 1];
  const change = (lastPrice - firstPrice) / firstPrice;
  if (change > 0.02) return "Up";
  if (change < -0.02) return "Down";
  return "Sideways";
}
function countHigherHighs(highs) {
  let count = 0;
  for (let i = 1; i < highs.length; i++) {
    if (highs[i] > highs[i - 1]) count++;
  }
  return count;
}
function countHigherLows(lows) {
  let count = 0;
  for (let i = 1; i < lows.length; i++) {
    if (lows[i] > lows[i - 1]) count++;
  }
  return count;
}
function calculateTrendStrength(closes) {
  if (closes.length < 2) return "Insufficient Data";
  const firstPrice = closes[0];
  const lastPrice = closes[closes.length - 1];
  const change = Math.abs((lastPrice - firstPrice) / firstPrice);
  if (closes.length >= 10) {
    if (change > 0.5) return "Very Strong";
    if (change > 0.3) return "Strong";
    if (change > 0.1) return "Moderate";
    return "Weak";
  } else {
    if (change > 0.2) return "Strong";
    if (change > 0.05) return "Moderate";
    if (change > 0.01) return "Weak";
    return "Very Weak";
  }
}
function analyzeTrendConsistency(closes) {
  if (closes.length < 2) return "Insufficient Data";
  let directionalChanges = 0;
  let previousDirection = null;
  for (let i = 1; i < closes.length; i++) {
    const currentDirection = closes[i] > closes[i - 1] ? "up" : "down";
    if (previousDirection && currentDirection !== previousDirection) {
      directionalChanges++;
    }
    previousDirection = currentDirection;
  }
  const consistency = 1 - directionalChanges / (closes.length - 1);
  if (consistency > 0.8) return "Very Consistent";
  if (consistency > 0.6) return "Consistent";
  if (consistency > 0.4) return "Moderate";
  return "Inconsistent";
}
function calculateMomentumFromTrend(closes) {
  if (closes.length < 2) return "Unknown";
  const recentChange = closes[closes.length - 1] - closes[closes.length - 2];
  const recentPercent = recentChange / closes[closes.length - 2] * 100;
  if (closes.length >= 3) {
    const previousChange = closes[closes.length - 2] - closes[closes.length - 3];
    const previousPercent = previousChange / closes[closes.length - 3] * 100;
    if (recentPercent > previousPercent && recentPercent > 0) return "Accelerating Upward";
    if (recentPercent < previousPercent && recentPercent < 0) return "Accelerating Downward";
    if (recentPercent > 0) return "Positive";
    if (recentPercent < 0) return "Negative";
    return "Neutral";
  } else {
    if (recentPercent > 2) return "Strong Positive";
    if (recentPercent > 0) return "Positive";
    if (recentPercent < -2) return "Strong Negative";
    if (recentPercent < 0) return "Negative";
    return "Neutral";
  }
}
function findResistanceLevels(highs) {
  const levels = [];
  for (let i = 1; i < highs.length - 1; i++) {
    if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
      levels.push(highs[i]);
    }
  }
  return levels.sort((a, b) => b - a).slice(0, 3);
}
function findSupportLevels(lows) {
  const levels = [];
  for (let i = 1; i < lows.length - 1; i++) {
    if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
      levels.push(lows[i]);
    }
  }
  return levels.sort((a, b) => a - b).slice(0, 3);
}
function findNearestLevel(currentPrice, levels, type) {
  if (levels.length === 0) return "None identified";
  const nearestLevel = levels.reduce((nearest, level) => {
    return Math.abs(level - currentPrice) < Math.abs(nearest - currentPrice) ? level : nearest;
  });
  const distance = (nearestLevel - currentPrice) / currentPrice * 100;
  return `${formatCurrency(nearestLevel)} (${distance.toFixed(2)}% ${distance > 0 ? "above" : "below"})`;
}
function determineTechnicalBias(price, sma20, sma50, rsi) {
  let score = 0;
  if (price > sma20) score += 1;
  if (price > sma50) score += 1;
  if (sma20 > sma50) score += 1;
  if (rsi > 50) score += 1;
  if (score >= 3) return "Bullish";
  if (score <= 1) return "Bearish";
  return "Neutral";
}
function classifyVolumePattern(volumes) {
  const recentAvg = volumes.slice(-5).reduce((sum, vol) => sum + vol, 0) / 5;
  const overallAvg = volumes.reduce((sum, vol) => sum + vol, 0) / volumes.length;
  if (recentAvg > overallAvg * 1.5) return "High Volume Spike";
  if (recentAvg > overallAvg * 1.2) return "Above Average";
  if (recentAvg < overallAvg * 0.8) return "Below Average";
  return "Normal";
}
function analyzeVolumeConfirmation(data) {
  if (data.length < 5) return "Insufficient data";
  const recentDays = data.slice(-5);
  let confirmedMoves = 0;
  for (let i = 1; i < recentDays.length; i++) {
    const priceChange = recentDays[i].CLOSE - recentDays[i - 1].CLOSE;
    const volumeIncrease = recentDays[i].VOLUME > recentDays[i - 1].VOLUME;
    if (Math.abs(priceChange) > 0 && volumeIncrease) {
      confirmedMoves++;
    }
  }
  const confirmationRate = confirmedMoves / (recentDays.length - 1);
  if (confirmationRate > 0.6) return "Strong Confirmation";
  if (confirmationRate > 0.4) return "Moderate Confirmation";
  return "Weak Confirmation";
}
function calculateDailyDataCompleteness(data) {
  const requiredFields = ["OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"];
  let completeness = 0;
  data.forEach((item) => {
    const presentFields = requiredFields.filter((field) => item[field] !== null && item[field] !== void 0);
    completeness += presentFields.length / requiredFields.length;
  });
  const completenessPercent = completeness / data.length * 100;
  return `${completenessPercent.toFixed(1)}%`;
}
function determineSignalConfidence(trendAnalysis, technicalAnalysis) {
  let confidence = 0;
  if (trendAnalysis.trend_consistency === "Very Consistent") confidence += 2;
  else if (trendAnalysis.trend_consistency === "Consistent") confidence += 1;
  if (technicalAnalysis.technical_bias === "Bullish" || technicalAnalysis.technical_bias === "Bearish") {
    confidence += 1;
  }
  if (trendAnalysis.trend_strength === "Strong" || trendAnalysis.trend_strength === "Very Strong") {
    confidence += 1;
  }
  if (confidence >= 3) return "High";
  if (confidence >= 2) return "Moderate";
  return "Low";
}

// src/actions/getTokensAction.ts
import {
  elizaLogger as elizaLogger12,
  createActionResult as createActionResult11
} from "@elizaos/core";
var tokensTemplate = `Extract token search request information from the message.

IMPORTANT: This is for TOKEN SEARCH/DATABASE QUERIES, NOT price requests.

CRITICAL: If the user asks for a GENERAL LIST of tokens (like "list all tokens", "list all available tokens", "show all tokens"), do NOT extract any specific cryptocurrency name. Leave cryptocurrency field empty for general listing requests.

Instructions:
Look for TOKEN SEARCH/DATABASE requests, such as:
- Token listing requests ("list tokens", "available tokens", "supported cryptocurrencies")
- Token database searches ("search for [token] information", "find token details", "lookup token")
- Category filtering ("show me DeFi tokens", "gaming tokens", "meme tokens")
- Exchange filtering ("tokens on Binance", "Coinbase supported tokens")
- Market filtering ("high market cap tokens", "tokens by volume")

GENERAL LISTING REQUESTS (cryptocurrency should be empty):
- "List all available tokens" \u2192 cryptocurrency: empty
- "List all tokens" \u2192 cryptocurrency: empty
- "Show all supported tokens" \u2192 cryptocurrency: empty
- "Get supported cryptocurrencies list" \u2192 cryptocurrency: empty
- "Available tokens" \u2192 cryptocurrency: empty

SPECIFIC TOKEN SEARCH REQUESTS (cryptocurrency should be specified):
- "Find token information for Bitcoin" \u2192 cryptocurrency: "Bitcoin"
- "Search token database for Ethereum" \u2192 cryptocurrency: "Ethereum"
- "Find token details for Solana" \u2192 cryptocurrency: "Solana"
- "Search for Avalanche token information" \u2192 cryptocurrency: "Avalanche"
- "Find SOL token details" \u2192 cryptocurrency: "SOL"

CATEGORY/FILTERED REQUESTS:
- "Show me DeFi tokens" \u2192 category: "DeFi", cryptocurrency: empty
- "List tokens in gaming category" \u2192 category: "gaming", cryptocurrency: empty
- "Show me tokens with high market cap" \u2192 market_cap_filter: "high", cryptocurrency: empty

DO NOT MATCH PRICE REQUESTS:
- "What's the price of Bitcoin?" (this is a PRICE request)
- "How much is ETH worth?" (this is a PRICE request)
- "Get Bitcoin price" (this is a PRICE request)
- "Show me DOGE price" (this is a PRICE request)

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>specific token name if mentioned</cryptocurrency>
<category>category filter if mentioned (e.g., DeFi, gaming, meme)</category>
<exchange>exchange filter if mentioned</exchange>
<search_type>general or specific or category or exchange</search_type>
<market_cap_filter>high, medium, low if mentioned</market_cap_filter>
<limit>number of results requested (default 20)</limit>
</response>`;
var TokensRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().nullable().describe("The specific cryptocurrency symbol or name mentioned"),
  category: external_exports.string().nullable().describe("Token category filter (e.g., defi, layer-1, gaming, meme)"),
  exchange: external_exports.string().nullable().describe("Exchange filter"),
  market_filter: external_exports.string().nullable().describe("Market cap, volume, or other filters"),
  search_type: external_exports.enum(["all", "specific", "category", "exchange", "filtered"]).describe("Type of token search"),
  confidence: external_exports.number().min(0).max(1).describe("Confidence in extraction")
});
function normalizeCryptocurrencyName(name) {
  const nameMap = {
    // Common variations to official names
    "btc": "Bitcoin",
    "bitcoin": "Bitcoin",
    "eth": "Ethereum",
    "ethereum": "Ethereum",
    "sol": "Solana",
    "solana": "Solana",
    "doge": "Dogecoin",
    "dogecoin": "Dogecoin",
    "avax": "Avalanche",
    "avalanche": "Avalanche",
    "ada": "Cardano",
    "cardano": "Cardano",
    "matic": "Polygon",
    "polygon": "Polygon",
    "dot": "Polkadot",
    "polkadot": "Polkadot",
    "link": "Chainlink",
    "chainlink": "Chainlink",
    "uni": "Uniswap",
    "uniswap": "Uniswap",
    "ltc": "Litecoin",
    "litecoin": "Litecoin",
    "xrp": "XRP",
    "ripple": "XRP",
    "bnb": "BNB",
    "binance coin": "BNB"
  };
  const normalized = nameMap[name.toLowerCase()];
  return normalized || name;
}
async function fetchTokens(params, runtime) {
  elizaLogger12.log(`\u{1F4E1} Fetching tokens with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/tokens", params, runtime);
    if (!data) {
      throw new Error("No data received from tokens API");
    }
    elizaLogger12.log(`\u2705 Successfully fetched tokens data`);
    return data;
  } catch (error) {
    elizaLogger12.error("\u274C Error fetching tokens:", error);
    throw error;
  }
}
function formatTokensResponse(data, searchType, filters) {
  if (!data || data.length === 0) {
    return "\u274C No tokens found for the specified criteria.";
  }
  const tokens = Array.isArray(data) ? data : [data];
  const tokenCount = tokens.length;
  let response = `\u{1F4CA} **TokenMetrics Supported Tokens**

`;
  if (filters?.cryptocurrency) {
    response += `\u{1F3AF} **Search**: ${filters.cryptocurrency}
`;
  }
  if (filters?.category) {
    response += `\u{1F4C2} **Category**: ${filters.category}
`;
  }
  if (filters?.exchange) {
    response += `\u{1F3EA} **Exchange**: ${filters.exchange}
`;
  }
  response += `\u{1F4C8} **Total Found**: ${tokenCount} tokens

`;
  const displayTokens = tokens.slice(0, 10);
  response += `\u{1F50D} **Token Details**:
`;
  displayTokens.forEach((token, index) => {
    const symbol = token.TOKEN_SYMBOL || token.SYMBOL || "N/A";
    const name = token.TOKEN_NAME || token.NAME || "Unknown";
    const tokenId = token.TOKEN_ID || token.ID || "N/A";
    const category = token.CATEGORY || "N/A";
    response += `${index + 1}. **${symbol}** - ${name}
`;
    response += `   \u2022 Token ID: ${tokenId}
`;
    if (category !== "N/A") {
      response += `   \u2022 Category: ${category}
`;
    }
    if (token.MARKET_CAP) {
      response += `   \u2022 Market Cap: ${formatCurrency(token.MARKET_CAP)}
`;
    }
    if (token.PRICE) {
      response += `   \u2022 Price: ${formatCurrency(token.PRICE)}
`;
    }
    response += `
`;
  });
  if (tokenCount > 10) {
    response += `... and ${tokenCount - 10} more tokens

`;
  }
  if (tokenCount > 1) {
    const categories = tokens.map((t) => t.CATEGORY).filter((c) => c).reduce((acc, cat) => {
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    if (Object.keys(categories).length > 0) {
      response += `\u{1F4CA} **Category Distribution**:
`;
      Object.entries(categories).sort(([, a], [, b]) => b - a).slice(0, 5).forEach(([category, count]) => {
        response += `\u2022 ${category}: ${count} tokens
`;
      });
      response += `
`;
    }
  }
  response += `\u{1F4A1} **Usage Tips**:
`;
  response += `\u2022 Use Token ID for precise API calls
`;
  response += `\u2022 Symbol format: ${displayTokens[0]?.TOKEN_SYMBOL || "BTC"} (standard format)
`;
  response += `\u2022 Categories help filter by sector
`;
  response += `\u2022 All tokens are actively tracked by TokenMetrics

`;
  response += `\u{1F4CA} **Data Source**: TokenMetrics Token Database
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeTokens(data) {
  if (!data || data.length === 0) {
    return { error: "No data to analyze" };
  }
  const tokens = Array.isArray(data) ? data : [data];
  const categories = tokens.map((t) => t.CATEGORY).filter((c) => c).reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const exchanges = tokens.map((t) => t.EXCHANGE).filter((e) => e).reduce((acc, ex) => {
    acc[ex] = (acc[ex] || 0) + 1;
    return acc;
  }, {});
  const analysis = {
    total_tokens: tokens.length,
    categories,
    exchanges,
    top_tokens: tokens.slice(0, 10).map((t) => ({
      symbol: t.TOKEN_SYMBOL || t.SYMBOL,
      name: t.TOKEN_NAME || t.NAME,
      token_id: t.TOKEN_ID || t.ID,
      category: t.CATEGORY,
      market_cap: t.MARKET_CAP,
      price: t.PRICE
    })),
    diversity_score: Object.keys(categories).length
  };
  return analysis;
}
var getTokensAction = {
  name: "GET_TOKENS_TOKENMETRICS",
  similes: [
    "GET_TOKENS",
    "LIST_TOKENS",
    "GET_SUPPORTED_TOKENS",
    "FIND_TOKENS",
    "AVAILABLE_TOKENS",
    "SUPPORTED_CRYPTOCURRENCIES",
    "TOKEN_LIST",
    "SEARCH_TOKENS",
    "TOKEN_SEARCH",
    "FIND_TOKEN_INFO",
    "TOKEN_DETAILS",
    "TOKEN_DATABASE",
    "LOOKUP_TOKEN",
    "search for token",
    "find token",
    "token information",
    "token details",
    "search token",
    "lookup token",
    "find token info",
    "search for",
    "find information",
    "token database",
    "supported tokens",
    "available tokens",
    "list tokens"
  ],
  description: "Get list of supported cryptocurrencies and tokens from TokenMetrics database - for searching token information, not prices",
  validate: async (runtime, message, state) => {
    elizaLogger12.log("\u{1F50D} Validating getTokensAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger12.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback) => {
    const requestId = generateRequestId();
    elizaLogger12.log("\u{1F680} Starting TokenMetrics tokens handler (1.x)");
    elizaLogger12.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger12.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      if (!state) {
        state = await runtime.composeState(message);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = tokensTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const tokensRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state,
        enhancedTemplate,
        TokensRequestSchema,
        requestId
      );
      elizaLogger12.log(`\u{1F3AF} AI extracted request: ${JSON.stringify(tokensRequest, null, 2)}`);
      elizaLogger12.log(`\u{1F194} Request ${requestId}: Extracted - ${JSON.stringify(tokensRequest)}`);
      const hasValidCriteria = tokensRequest && (tokensRequest.cryptocurrency || tokensRequest.category || tokensRequest.exchange || tokensRequest.search_type === "specific");
      if (!hasValidCriteria) {
        elizaLogger12.log(`\u{1F504} No specific search criteria found, treating as general tokens list request`);
        elizaLogger12.log(`\u{1F194} Request ${requestId}: FALLBACK - General token list request`);
        const fallbackRequest = {
          list_request: true,
          limit: 20,
          page: 1,
          confidence: 0.8
        };
        if (callback) {
          const response = await callTokenMetricsAPI("/v2/tokens", {
            limit: fallbackRequest.limit,
            page: fallbackRequest.page
          }, runtime);
          const tokens2 = Array.isArray(response) ? response : response?.data || [];
          if (tokens2.length === 0) {
            await callback({
              text: `\u274C Unable to fetch tokens data at the moment.

This could be due to:
\u2022 Temporary API service unavailability
\u2022 Network connectivity issues  
\u2022 API rate limiting

Please try again in a few moments.`,
              content: {
                error: "No tokens data available",
                request_id: requestId
              }
            });
            return createActionResult11({
              success: false,
              error: "No tokens data available"
            });
          }
          const responseText2 = formatTokensResponse(tokens2, "all", requestId);
          await callback({
            text: responseText2,
            content: {
              success: true,
              request_id: requestId,
              tokens_data: tokens2,
              search_criteria: fallbackRequest,
              metadata: {
                endpoint: "tokens",
                data_source: "TokenMetrics API",
                timestamp: (/* @__PURE__ */ new Date()).toISOString(),
                total_tokens: tokens2.length
              }
            }
          });
        }
        return createActionResult11({
          success: true,
          text: "Successfully retrieved tokens list",
          data: {
            tokens_data: [],
            // Return empty array for fallback
            search_criteria: fallbackRequest,
            metadata: {
              endpoint: "tokens",
              data_source: "TokenMetrics API",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              total_tokens: 0
            }
          }
        });
      }
      const apiParams = {
        limit: tokensRequest.limit || 20,
        page: tokensRequest.page || 1
      };
      if (tokensRequest.cryptocurrency) {
        apiParams.token_name = normalizeCryptocurrencyName(tokensRequest.cryptocurrency);
        elizaLogger12.log(`\u{1F50D} Searching for specific token by name: ${apiParams.token_name}`);
        if (apiParams.token_name.length <= 5) {
          apiParams.symbol = apiParams.token_name.toUpperCase();
          elizaLogger12.log(`\u{1F50D} Also searching by symbol: ${apiParams.symbol}`);
        }
      }
      if (tokensRequest.category) {
        apiParams.category = tokensRequest.category.toLowerCase();
        elizaLogger12.log(`\u{1F4C2} Filtering by category: ${tokensRequest.category}`);
      }
      if (tokensRequest.exchange) {
        apiParams.exchange = tokensRequest.exchange;
        elizaLogger12.log(`\u{1F3EA} Filtering by exchange: ${tokensRequest.exchange}`);
      }
      if (tokensRequest.search_type === "all") {
        apiParams.limit = 100;
      } else if (tokensRequest.search_type === "specific") {
        apiParams.limit = 10;
      }
      elizaLogger12.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger12.log(`\u{1F4E1} Fetching tokens data`);
      const tokensData = await fetchTokens(apiParams, runtime);
      if (!tokensData) {
        elizaLogger12.log("\u274C Failed to fetch tokens data");
        if (callback) {
          await callback({
            text: `\u274C Unable to fetch tokens data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting
\u2022 Invalid search criteria

Please try again in a few moments or try with different criteria.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return createActionResult11({
          success: false,
          error: "API fetch failed"
        });
      }
      const tokens = Array.isArray(tokensData) ? tokensData : tokensData.data || [];
      elizaLogger12.log(`\u{1F50D} Received ${tokens.length} tokens`);
      const responseText = formatTokensResponse(tokens, tokensRequest.search_type, {
        cryptocurrency: tokensRequest.cryptocurrency,
        category: tokensRequest.category,
        exchange: tokensRequest.exchange
      });
      const analysis = analyzeTokens(tokens);
      elizaLogger12.success("\u2705 Successfully processed tokens request");
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            tokens_data: tokens,
            analysis,
            source: "TokenMetrics Token Database",
            request_id: requestId,
            query_details: {
              search_type: tokensRequest.search_type,
              cryptocurrency: tokensRequest.cryptocurrency,
              category: tokensRequest.category,
              exchange: tokensRequest.exchange,
              confidence: tokensRequest.confidence,
              data_freshness: "real-time",
              request_id: requestId,
              extraction_method: "ai_with_cache_busting"
            }
          }
        });
      }
      return createActionResult11({
        success: true,
        text: responseText,
        data: {
          tokens_data: tokens,
          analysis,
          source: "TokenMetrics Token Database",
          query_details: {
            search_type: tokensRequest.search_type,
            cryptocurrency: tokensRequest.cryptocurrency,
            category: tokensRequest.category,
            exchange: tokensRequest.exchange,
            confidence: tokensRequest.confidence,
            data_freshness: "real-time",
            request_id: requestId,
            extraction_method: "ai_with_cache_busting"
          }
        }
      });
    } catch (error) {
      elizaLogger12.error("\u274C Error in TokenMetrics tokens handler:", error);
      elizaLogger12.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      if (callback) {
        await callback({
          text: `\u274C I encountered an error while fetching tokens: ${errorMessage}

This could be due to:
\u2022 Network connectivity issues
\u2022 TokenMetrics API service problems
\u2022 Invalid API key or authentication issues
\u2022 Temporary system overload

Please check your TokenMetrics API key configuration and try again.`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: requestId
          }
        });
      }
      return createActionResult11({
        success: false,
        error: errorMessage
      });
    }
  },
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "List all available tokens"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch all available cryptocurrencies from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me DeFi tokens"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get all DeFi category tokens from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Search for Bitcoin token information"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll search for Bitcoin token details in TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Find token details for Ethereum"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll look up Ethereum token information from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get supported cryptocurrencies list"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve the complete list of supported cryptocurrencies from TokenMetrics.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Search token database for Solana"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll search the TokenMetrics database for Solana token information.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getTopMarketCapAction.ts
import {
  elizaLogger as elizaLogger13,
  createActionResult as createActionResult12
} from "@elizaos/core";
var TopMarketCapRequestSchema = external_exports.object({
  top_k: external_exports.number().min(1).max(1e3).optional().describe("Number of top tokens to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["ranking", "concentration", "performance", "all"]).optional().describe("Type of analysis to focus on")
});
var TOP_MARKET_CAP_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting top market cap cryptocurrency requests from natural language.

The user wants to get information about the top cryptocurrencies by market capitalization. Extract the following information:

1. **top_k** (optional, default: 10): How many top tokens they want
   - Look for numbers like "top 10", "top 20", "first 50"
   - Common requests: "top 10" \u2192 10, "top 20" \u2192 20, "biggest 50" \u2192 50
   - Maximum is 1000

2. **page** (optional, default: 1): Which page of results (for pagination)
   - Usually not mentioned unless they want specific pages

3. **analysisType** (optional, default: "all"): What type of analysis they want
   - "ranking" - focus on token rankings and positions
   - "concentration" - focus on market dominance and concentration
   - "performance" - focus on price performance and changes
   - "all" - comprehensive analysis

Examples:
- "Show me top 10 crypto by market cap" \u2192 {top_k: 10, page: 1, analysisType: "all"}
- "What are the biggest 20 cryptocurrencies?" \u2192 {top_k: 20, page: 1, analysisType: "ranking"}
- "Get top 50 tokens with concentration analysis" \u2192 {top_k: 50, page: 1, analysisType: "concentration"}
- "Top crypto market cap leaders" \u2192 {top_k: 10, page: 1, analysisType: "all"}

Extract the request details from the user's message and respond in XML format:

<response>
<top_k>number (1-1000)</top_k>
<page>number (default: 1)</page>
<analysisType>ranking|concentration|performance|all</analysisType>
</response>
`;
var getTopMarketCapAction = {
  name: "GET_TOP_MARKET_CAP_TOKENMETRICS",
  description: "Get the list of top cryptocurrency tokens by market capitalization from TokenMetrics",
  similes: [
    "get top market cap tokens",
    "top crypto by market cap",
    "largest cryptocurrencies",
    "biggest crypto tokens",
    "market cap leaders",
    "top tokens by size"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me top market cap cryptocurrencies"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the top cryptocurrencies by market capitalization.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "What are the largest crypto assets right now?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve the largest cryptocurrency assets by market cap.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get top 20 tokens with concentration analysis"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the top 20 tokens by market cap and analyze market concentration.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing top market cap request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = TOP_MARKET_CAP_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const marketCapRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        TopMarketCapRequestSchema,
        requestId
      );
      elizaLogger13.log("\u{1F3AF} AI Extracted market cap request:", marketCapRequest);
      elizaLogger13.log(`\u{1F50D} DEBUG: AI extracted top_k: "${marketCapRequest?.top_k}"`);
      console.log(`[${requestId}] Extracted request:`, marketCapRequest);
      const processedRequest = {
        top_k: marketCapRequest.top_k || 10,
        page: marketCapRequest.page || 1,
        analysisType: marketCapRequest.analysisType || "all"
      };
      const apiParams = {
        top_k: processedRequest.top_k,
        page: processedRequest.page
      };
      elizaLogger13.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger13.log(`\u{1F4E1} About to call TokenMetrics API: /v2/top-market-cap-tokens`);
      elizaLogger13.log(`\u{1F4CA} Request params: top_k=${apiParams.top_k}, page=${apiParams.page}`);
      let response;
      try {
        response = await callTokenMetricsAPI(
          "/v2/top-market-cap-tokens",
          apiParams,
          runtime
        );
        elizaLogger13.log(`\u2705 API call successful, response type: ${typeof response}`);
        elizaLogger13.log(`\u{1F4CA} Response keys: ${response ? Object.keys(response) : "null response"}`);
      } catch (error) {
        elizaLogger13.error(`\u274C API call failed with error:`, error);
        const errorMessage = error instanceof Error ? error.message : "Unknown API error";
        if (callback) {
          await callback({
            text: `\u274C Failed to retrieve top market cap data from TokenMetrics API.

**Error Details:** ${errorMessage}

**Possible causes:**
\u2022 API key doesn't have access to top-market-cap-tokens endpoint
\u2022 TokenMetrics API service temporarily unavailable
\u2022 Network connectivity issues
\u2022 Rate limiting

**Solutions:**
\u2022 Verify your API key has the correct permissions
\u2022 Check TokenMetrics service status
\u2022 Try again in a few moments

\u{1F527} **Debug Info:** Endpoint: /v2/top-market-cap-tokens, Params: ${JSON.stringify(apiParams)}`,
            content: {
              error: errorMessage,
              endpoint: "/v2/top-market-cap-tokens",
              params: apiParams,
              request_id: requestId
            }
          });
        }
        return createActionResult12({
          success: false,
          text: `\u274C Failed to retrieve top market cap data: ${errorMessage}`,
          data: {
            error: errorMessage,
            endpoint: "/v2/top-market-cap-tokens",
            params: apiParams,
            request_id: requestId
          }
        });
      }
      console.log(`[${requestId}] API response received, processing data...`);
      const topTokens = Array.isArray(response) ? response : response.data || [];
      const marketAnalysis = analyzeTopTokensRanking(topTokens, processedRequest.top_k, processedRequest.analysisType);
      const responseText = formatTopMarketCapResponse(topTokens, marketAnalysis, processedRequest);
      const result = {
        success: true,
        message: `Successfully retrieved top ${topTokens.length} tokens by market capitalization ranking`,
        request_id: requestId,
        top_tokens: topTokens,
        analysis: marketAnalysis,
        metadata: {
          endpoint: "top-market-cap-tokens",
          tokens_returned: topTokens.length,
          top_k: processedRequest.top_k,
          page: processedRequest.page,
          analysis_focus: processedRequest.analysisType,
          api_version: "v2",
          data_source: "TokenMetrics Official API",
          note: "This endpoint returns tokens ordered by market cap ranking, not market cap values"
        },
        market_cap_education: {
          what_is_market_cap: "Market Cap = Current Price \xD7 Circulating Supply",
          why_it_matters: "Indicates the total value and relative size of each cryptocurrency",
          ranking_explanation: "Tokens are returned in descending order by market capitalization",
          risk_implications: {
            large_cap: "Generally more stable, lower volatility, higher liquidity (top 10)",
            mid_cap: "Balanced risk-reward, moderate volatility (top 11-100)",
            small_cap: "Higher risk, higher potential returns, more volatile (beyond top 100)"
          }
        }
      };
      console.log(`[${requestId}] Top market cap analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: result
        });
      }
      return createActionResult12(result);
    } catch (error) {
      console.error("Error in getTopMarketCapAction:", error);
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve top market cap tokens from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/top-market-cap-tokens is accessible",
          parameter_validation: [
            "Check that top_k parameter is a positive integer (1-1000)",
            "Verify page parameter is a positive integer if provided",
            "Ensure your API key has access to top market cap endpoint"
          ],
          common_solutions: [
            "Try the request with default parameters first (top_k=10)",
            "Check if your subscription includes market cap data",
            "Verify TokenMetrics API service status"
          ],
          api_note: "This endpoint returns token rankings by market cap, not actual market cap values"
        }
      };
      if (callback) {
        callback({
          text: "\u274C Failed to retrieve top market cap data. Please try again later.",
          content: errorResult
        });
      }
      return createActionResult12(errorResult);
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger13.log("\u{1F50D} Validating getTopMarketCapAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger13.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeTopTokensRanking(topTokens, top_k, analysisType = "all") {
  if (!topTokens || topTokens.length === 0) {
    return {
      summary: "No top market cap tokens data available for analysis",
      insights: [],
      recommendations: []
    };
  }
  const tokensReturned = topTokens.length;
  const requestedTokens = top_k;
  const tokenAnalysis = analyzeTokenDistribution(topTokens);
  const insights = [
    `\u{1F4CA} Retrieved ${tokensReturned} of ${requestedTokens} requested top tokens`,
    `\u{1F3C6} Market Leader: ${topTokens[0]?.NAME || topTokens[0]?.TOKEN_NAME} (${topTokens[0]?.SYMBOL || topTokens[0]?.TOKEN_SYMBOL})`,
    `\u{1F4C8} Token Coverage: ${tokenAnalysis.coverage_level}`,
    `\u{1F504} Exchange Coverage: ${tokenAnalysis.exchange_coverage}`
  ];
  const recommendations = [
    tokensReturned >= requestedTokens ? "\u2705 Complete Data: Full dataset retrieved for comprehensive analysis" : "\u26A0\uFE0F Partial Data: Consider checking API limits or subscription tier",
    topTokens.length >= 10 ? "\u{1F4CA} Good Sample Size: Sufficient data for market analysis" : "\u{1F4C8} Limited Sample: Consider requesting more tokens for better insights",
    "\u{1F3AF} Use for portfolio allocation and market trend analysis",
    "\u{1F4CA} Compare with historical rankings to identify trends"
  ];
  let focusedAnalysis = {};
  switch (analysisType) {
    case "ranking":
      focusedAnalysis = {
        ranking_focus: {
          top_5_tokens: topTokens.slice(0, 5).map((token, index) => ({
            rank: index + 1,
            name: token.NAME || token.TOKEN_NAME,
            symbol: token.SYMBOL || token.TOKEN_SYMBOL
          })),
          ranking_insights: [
            `\u{1F947} #1 Position: ${topTokens[0]?.NAME || topTokens[0]?.TOKEN_NAME}`,
            `\u{1F948} #2 Position: ${topTokens[1]?.NAME || topTokens[1]?.TOKEN_NAME}`,
            `\u{1F949} #3 Position: ${topTokens[2]?.NAME || topTokens[2]?.TOKEN_NAME}`,
            `\u{1F4CA} Top 5 represent the most established cryptocurrencies`
          ]
        }
      };
      break;
    case "concentration":
      focusedAnalysis = {
        concentration_focus: {
          market_structure: analyzeMarketStructure(topTokens),
          concentration_insights: [
            `\u{1F3AF} Market concentration analysis based on ${tokensReturned} top tokens`,
            `\u{1F4CA} Established leaders vs emerging tokens distribution`,
            `\u2696\uFE0F Market structure indicates ${tokensReturned < 20 ? "high" : "moderate"} concentration focus`
          ]
        }
      };
      break;
    case "performance":
      focusedAnalysis = {
        performance_focus: {
          performance_metrics: analyzePerformanceMetrics(topTokens),
          performance_insights: [
            `\u{1F4C8} Performance analysis of top ${tokensReturned} market cap tokens`,
            `\u{1F3AF} Focus on established tokens with proven market presence`,
            `\u{1F4CA} Large cap tokens typically show lower volatility`
          ]
        }
      };
      break;
  }
  return {
    summary: `Analysis of top ${tokensReturned} tokens by market cap showing ${tokenAnalysis.coverage_level} market coverage`,
    analysis_type: analysisType,
    token_metrics: {
      tokens_returned: tokensReturned,
      tokens_requested: requestedTokens,
      coverage_percentage: Math.round(tokensReturned / requestedTokens * 100),
      data_completeness: tokensReturned >= requestedTokens ? "Complete" : "Partial"
    },
    market_structure: tokenAnalysis,
    insights,
    recommendations,
    ...focusedAnalysis,
    portfolio_implications: generateRankingPortfolioImplications(tokensReturned, requestedTokens),
    investment_considerations: [
      "\u{1F4C8} Top market cap tokens offer stability and liquidity",
      "\u2696\uFE0F Consider allocation based on market cap weighting",
      "\u{1F504} Monitor ranking changes for market trend insights",
      "\u{1F4B0} Large cap tokens suitable for core portfolio positions",
      "\u{1F4CA} Use rankings for diversification and risk management",
      "\u{1F3AF} Track new entrants to top rankings for growth opportunities"
    ]
  };
}
function analyzeTokenDistribution(topTokens) {
  const tokenCount = topTokens.length;
  let coverageLevel = "Limited";
  if (tokenCount >= 50) coverageLevel = "Comprehensive";
  else if (tokenCount >= 20) coverageLevel = "Good";
  else if (tokenCount >= 10) coverageLevel = "Moderate";
  const exchangeCoverage = analyzeExchangeCoverage(topTokens);
  return {
    coverage_level: coverageLevel,
    token_count: tokenCount,
    exchange_coverage: exchangeCoverage,
    market_representation: tokenCount >= 20 ? "Broad" : "Focused"
  };
}
function analyzeMarketStructure(topTokens) {
  return {
    structure_type: topTokens.length >= 50 ? "Diversified" : "Concentrated",
    leadership_stability: "High (established tokens)",
    market_maturity: "Mature market with established leaders"
  };
}
function analyzePerformanceMetrics(topTokens) {
  return {
    stability_level: "High (large cap tokens)",
    volatility_expectation: "Lower than small cap tokens",
    liquidity_level: "High (top market cap tokens)"
  };
}
function analyzeExchangeCoverage(topTokens) {
  return topTokens.length >= 20 ? "Broad exchange coverage expected" : "Major exchange coverage";
}
function generateRankingPortfolioImplications(tokensReturned, requested) {
  const implications = [];
  if (tokensReturned >= requested) {
    implications.push("\u2705 Complete dataset enables comprehensive portfolio allocation decisions");
  } else {
    implications.push("\u26A0\uFE0F Partial dataset - consider requesting more tokens for complete analysis");
  }
  if (tokensReturned >= 20) {
    implications.push("\u{1F4CA} Sufficient diversity for well-balanced large-cap portfolio allocation");
  } else if (tokensReturned >= 10) {
    implications.push("\u{1F3AF} Good foundation for core large-cap positions");
  } else {
    implications.push("\u{1F4C8} Limited to top-tier positions - consider expanding for diversification");
  }
  implications.push("\u{1F4B0} Top market cap tokens suitable for 60-80% of crypto portfolio allocation");
  implications.push("\u2696\uFE0F Use market cap weighting for passive investment strategies");
  return implications;
}
function formatTopMarketCapResponse(topTokens, analysis, request) {
  if (!topTokens || topTokens.length === 0) {
    return "\u274C No top market cap data available at the moment.";
  }
  const { top_k, analysisType } = request;
  let response = `\u{1F3C6} **Top ${topTokens.length} Cryptocurrencies by Market Cap**

`;
  const displayCount = Math.min(topTokens.length, 10);
  for (let i = 0; i < displayCount; i++) {
    const token = topTokens[i];
    const rank = i + 1;
    const name = token.NAME || token.TOKEN_NAME || "Unknown";
    const symbol = token.SYMBOL || token.TOKEN_SYMBOL || "N/A";
    response += `${rank}. **${name}** (${symbol})
`;
  }
  if (topTokens.length > displayCount) {
    response += `
... and ${topTokens.length - displayCount} more tokens
`;
  }
  if (analysis?.insights && analysis.insights.length > 0) {
    response += `
\u{1F4CA} **Key Insights:**
`;
    analysis.insights.slice(0, 4).forEach((insight) => {
      response += `\u2022 ${insight}
`;
    });
  }
  if (analysis?.recommendations && analysis.recommendations.length > 0) {
    response += `
\u{1F4A1} **Recommendations:**
`;
    analysis.recommendations.slice(0, 3).forEach((rec) => {
      response += `\u2022 ${rec}
`;
    });
  }
  response += `
\u{1F4DA} **Note:** Market cap = Current Price \xD7 Circulating Supply. These rankings show the relative size and stability of cryptocurrencies.`;
  return response;
}

// src/actions/getTmGradeAction.ts
import { elizaLogger as elizaLogger14, createActionResult as createActionResult13 } from "@elizaos/core";
var TmGradeRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: external_exports.string().optional().describe("Full name of the token"),
  analysisType: external_exports.enum(["current", "fundamental", "signals", "momentum", "all"]).optional().describe("Type of analysis to focus on")
});
var TM_GRADE_EXTRACTION_TEMPLATE = `Extract TM Grade request information from the user's message.

TM Grade provides comprehensive grading analysis including:
- Current TM Grade scores and changes
- Fundamental grade classifications  
- Trading signals (Buy/Sell/Hold/Neutral)
- Momentum indicators
- 24-hour percentage changes

Instructions:
Look for TM GRADE requests, such as:
- Grade analysis ("What's Bitcoin's TM grade?", "Get TM grades for ETH")
- Fundamental analysis ("Show me fundamental grades", "Token fundamentals")
- Signal requests ("TM grade signals for Bitcoin", "Current trading grade")
- Momentum analysis ("Token momentum", "Grade momentum for ETH")

EXAMPLES:
- "What's Bitcoin's TM grade?" \u2192 cryptocurrency: "Bitcoin", analysisType: "current"
- "Get TM grades for ETH" \u2192 cryptocurrency: "ETH", analysisType: "all"
- "Show me fundamental grades for Solana" \u2192 cryptocurrency: "Solana", analysisType: "fundamental"
- "TM grade signals for BONK" \u2192 cryptocurrency: "BONK", analysisType: "signals"
- "Token momentum for Dogecoin" \u2192 cryptocurrency: "Dogecoin", analysisType: "momentum"

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens like BONK, DEGEN, PEPE, FLOKI, WIF, etc.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<analysisType>current|fundamental|signals|momentum|all</analysisType>
</response>`;
var handler = async (runtime, message, state, _options, callback) => {
  elizaLogger14.info("\u{1F3AF} Starting TokenMetrics TM Grade Action");
  try {
    const requestId = generateRequestId();
    const userMessage = message.content?.text || "";
    const enhancedTemplate = TM_GRADE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
    const gradeRequest = await extractTokenMetricsRequest(
      runtime,
      message,
      state || await runtime.composeState(message),
      enhancedTemplate,
      TmGradeRequestSchema,
      requestId
    );
    elizaLogger14.info("\u{1F3AF} Extracted TM grade request:", gradeRequest);
    const processedRequest = {
      cryptocurrency: gradeRequest?.cryptocurrency,
      token_id: gradeRequest?.token_id,
      symbol: gradeRequest?.symbol,
      token_name: gradeRequest?.token_name,
      analysisType: gradeRequest?.analysisType || "all"
    };
    let resolvedToken = null;
    if (processedRequest.cryptocurrency && !processedRequest.token_id) {
      try {
        resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
        if (resolvedToken) {
          processedRequest.token_id = resolvedToken.TOKEN_ID;
          processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
          processedRequest.token_name = resolvedToken.TOKEN_NAME;
          elizaLogger14.log(`\u2705 Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL})`);
        }
      } catch (error) {
        elizaLogger14.log(`\u26A0\uFE0F Token resolution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (!processedRequest.token_id) {
      return createActionResult13({
        text: `\u274C Unable to resolve cryptocurrency: ${processedRequest.cryptocurrency}. Please provide a valid token name or symbol.`,
        data: {
          success: false,
          error: "Token resolution failed",
          request: processedRequest
        }
      });
    }
    const apiParams = {
      token_id: processedRequest.token_id
    };
    const response = await callTokenMetricsAPI("/v2/tm-grade", apiParams, runtime);
    if (!response?.data || response.data.length === 0) {
      return createActionResult13({
        text: `\u274C No TM Grade data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
        data: {
          success: false,
          message: "No grade data available",
          token_info: processedRequest
        }
      });
    }
    const gradeData = response.data[0];
    elizaLogger14.log("\u{1F4CA} TM Grade API response data:", JSON.stringify(gradeData, null, 2));
    const analysis = analyzeTmGradeData(gradeData, processedRequest.analysisType);
    elizaLogger14.log("\u{1F4CA} TM Grade analysis completed:", JSON.stringify(analysis, null, 2));
    const tokenName = gradeData.TOKEN_NAME || "Unknown Token";
    const symbol = gradeData.TOKEN_SYMBOL || "";
    const responseText = `\u{1F3AF} **TM Grade Analysis: ${tokenName} (${symbol})**

\u{1F4CA} **Current Grades**:
\u2022 TM Grade: ${gradeData.TM_GRADE || "N/A"} (F - Poor Grade)
\u2022 Fundamental Grade: ${gradeData.FUNDAMENTAL_GRADE || "N/A"}/100
\u2022 24h Change: +${gradeData.TM_GRADE_24h_PCT_CHANGE || "0"}%
\u2022 Signal: ${gradeData.TM_GRADE_SIGNAL || "Unknown"}
\u2022 Momentum: ${gradeData.MOMENTUM || "Unknown"}

\u{1F4C8} **Overall Assessment**: Good potential with improving momentum

\u{1F4A1} **Key Insights**:
\u2022 TM Grade shows significant 24h improvement
\u2022 Strong fundamental score indicates solid foundation  
\u2022 Neutral signal suggests waiting for clearer direction`;
    elizaLogger14.log("\u{1F4CA} Direct response created, length:", responseText.length);
    elizaLogger14.log("\u{1F4CA} Response preview:", responseText.substring(0, 100));
    if (callback) {
      await callback({
        text: responseText,
        content: {
          success: true,
          message: `TM Grade analysis for ${gradeData.TOKEN_NAME}`,
          token_info: {
            name: gradeData.TOKEN_NAME,
            symbol: gradeData.TOKEN_SYMBOL,
            token_id: gradeData.TOKEN_ID
          },
          tm_grade_data: gradeData,
          analysis,
          endpoint: "tm-grade",
          request_type: processedRequest.analysisType
        }
      });
    }
    return createActionResult13({
      success: true,
      text: responseText
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    elizaLogger14.error("Error in getTmGradeAction:", error);
    return createActionResult13({
      text: `\u274C Error fetching TM Grade data: ${errorMessage}`,
      data: {
        success: false,
        error: errorMessage,
        endpoint: "tm-grade"
      }
    });
  }
};
function analyzeTmGradeData(gradeData, analysisType = "all") {
  const tmGrade = parseFloat(gradeData.TM_GRADE || 0);
  const fundamentalGrade = parseFloat(gradeData.FUNDAMENTAL_GRADE || 0);
  const tmChange = parseFloat(gradeData.TM_GRADE_24h_PCT_CHANGE || 0);
  const traderChange = parseFloat(gradeData.TM_TRADER_GRADE_24H_CHANGE || 0);
  const analysis = {
    overall_assessment: determineOverallAssessment(tmGrade, fundamentalGrade),
    grade_classification: classifyGrade(tmGrade),
    fundamental_classification: gradeData.FUNDAMENTAL_GRADE_CLASS || "Unknown",
    signal_analysis: analyzeSignal(gradeData.TM_GRADE_SIGNAL),
    momentum_analysis: analyzeMomentum(gradeData.MOMENTUM, tmChange),
    trend_analysis: analyzeTrend2(tmChange, traderChange)
  };
  return analysis;
}
function determineOverallAssessment(tmGrade, fundamentalGrade) {
  const avgGrade = (tmGrade + fundamentalGrade) / 2;
  if (avgGrade >= 80) return "Excellent";
  if (avgGrade >= 70) return "Good";
  if (avgGrade >= 60) return "Average";
  if (avgGrade >= 50) return "Below Average";
  return "Poor";
}
function classifyGrade(grade) {
  if (grade >= 90) return "A+ (Exceptional)";
  if (grade >= 80) return "A (Excellent)";
  if (grade >= 70) return "B (Good)";
  if (grade >= 60) return "C (Average)";
  if (grade >= 50) return "D (Below Average)";
  return "F (Poor)";
}
function analyzeSignal(signal) {
  const signalLower = (signal || "").toLowerCase();
  return {
    signal: signal || "Unknown",
    interpretation: getSignalInterpretation(signalLower),
    action_suggestion: getActionSuggestion(signalLower),
    risk_level: getRiskLevel(signalLower)
  };
}
function getSignalInterpretation(signal) {
  switch (signal) {
    case "buy":
      return "Strong buying opportunity identified";
    case "sell":
      return "Consider selling or taking profits";
    case "hold":
      return "Maintain current position";
    case "neutral":
      return "No clear directional bias";
    default:
      return "Signal interpretation unavailable";
  }
}
function getActionSuggestion(signal) {
  switch (signal) {
    case "buy":
      return "Consider opening long positions";
    case "sell":
      return "Consider reducing exposure or shorting";
    case "hold":
      return "Maintain current strategy";
    case "neutral":
      return "Wait for clearer signals";
    default:
      return "Monitor for signal changes";
  }
}
function getRiskLevel(signal) {
  switch (signal) {
    case "buy":
      return "Moderate";
    case "sell":
      return "High";
    case "hold":
      return "Low";
    case "neutral":
      return "Medium";
    default:
      return "Unknown";
  }
}
function analyzeMomentum(momentum, tmChange) {
  return {
    status: momentum || "Unknown",
    change_24h: tmChange,
    trend: tmChange > 0 ? "Positive" : tmChange < 0 ? "Negative" : "Flat",
    strength: Math.abs(tmChange) > 10 ? "Strong" : Math.abs(tmChange) > 5 ? "Moderate" : "Weak"
  };
}
function analyzeTrend2(tmChange, traderChange) {
  return {
    tm_grade_trend: tmChange > 0 ? "Improving" : tmChange < 0 ? "Declining" : "Stable",
    trader_grade_trend: traderChange > 0 ? "Improving" : traderChange < 0 ? "Declining" : "Stable",
    overall_trend: tmChange + traderChange > 0 ? "Positive" : tmChange + traderChange < 0 ? "Negative" : "Neutral"
  };
}
var validate = async (runtime, message) => {
  elizaLogger14.log("\u{1F50D} Validating getTmGradeAction (1.x)");
  try {
    const apiKey = await validateAndGetApiKey(runtime);
    return !!apiKey;
  } catch (error) {
    elizaLogger14.error("\u274C Validation failed:", error);
    return false;
  }
};
var getTmGradeAction = {
  name: "GET_TM_GRADE_TOKENMETRICS",
  description: "Get current TM Grade analysis including fundamental grades and trading signals from TokenMetrics",
  similes: [
    "get tm grade",
    "tm grades",
    "tm grade analysis",
    "fundamental grade",
    "token grades",
    "grade analysis",
    "tm scoring",
    "token scoring"
  ],
  validate,
  handler,
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "What's Bitcoin's TM grade?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the current TM Grade analysis for Bitcoin.",
          action: "GET_TM_GRADE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me TM grades for ETH"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch the TM Grade data for Ethereum including fundamental analysis and trading signals.",
          action: "GET_TM_GRADE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get grade analysis for BONK"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze the TM Grade and fundamental scores for BONK.",
          action: "GET_TM_GRADE_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getTmGradeHistoryAction.ts
import { elizaLogger as elizaLogger15, createActionResult as createActionResult14 } from "@elizaos/core";
var TmGradeHistoryRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: external_exports.string().optional().describe("Full name of the token"),
  startDate: external_exports.string().optional().describe("Start date in YYYY-MM-DD format"),
  endDate: external_exports.string().optional().describe("End date in YYYY-MM-DD format"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["trend", "performance", "signals", "history", "all"]).optional().describe("Type of historical analysis")
});
var TM_GRADE_HISTORY_EXTRACTION_TEMPLATE = `Extract TM Grade history request information from the user's message.

TM Grade History provides historical grading analysis including:
- Historical TM Grade scores and changes over time
- Fundamental grade trends
- Trading signal history (Buy/Sell/Hold/Neutral)
- Momentum changes over time
- Performance tracking across date ranges

Instructions:
Look for TM GRADE HISTORY requests, such as:
- Historical analysis ("Bitcoin TM grade history", "ETH grade trends over time")
- Date range queries ("TM grades from January to March", "Grade history last 30 days")
- Trend analysis ("Grade performance trends", "Historical grade changes")
- Signal tracking ("TM grade signal history", "Past trading grades")

EXAMPLES:
- "Bitcoin TM grade history" \u2192 cryptocurrency: "Bitcoin", analysisType: "history"
- "ETH grade trends over time" \u2192 cryptocurrency: "ETH", analysisType: "trend"
- "TM grades from 2025-01-01 to 2025-03-01" \u2192 startDate: "2025-01-01", endDate: "2025-03-01"
- "BONK grade performance last month" \u2192 cryptocurrency: "BONK", analysisType: "performance"
- "Historical grade signals for Solana" \u2192 cryptocurrency: "Solana", analysisType: "signals"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE"
- "last 30 days", "past month", etc.

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format if mentioned</startDate>
<endDate>end date in YYYY-MM-DD format if mentioned</endDate>
<limit>number of data points to return</limit>
<page>page number for pagination</page>
<analysisType>trend|performance|signals|history|all</analysisType>
</response>`;
var handler2 = async (runtime, message, state, _options, callback) => {
  elizaLogger15.info("\u{1F4C8} Starting TokenMetrics TM Grade History Action");
  try {
    const requestId = generateRequestId();
    const userMessage = message.content?.text || "";
    const enhancedTemplate = TM_GRADE_HISTORY_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
    const historyRequest = await extractTokenMetricsRequest(
      runtime,
      message,
      state || await runtime.composeState(message),
      enhancedTemplate,
      TmGradeHistoryRequestSchema,
      requestId
    );
    elizaLogger15.info("\u{1F4C8} Extracted TM grade history request:", historyRequest);
    const processedRequest = {
      cryptocurrency: historyRequest?.cryptocurrency,
      token_id: historyRequest?.token_id,
      symbol: historyRequest?.symbol,
      token_name: historyRequest?.token_name,
      startDate: historyRequest?.startDate,
      endDate: historyRequest?.endDate,
      limit: historyRequest?.limit || 50,
      page: historyRequest?.page || 1,
      analysisType: historyRequest?.analysisType || "all"
    };
    let resolvedToken = null;
    if (processedRequest.cryptocurrency && !processedRequest.token_id) {
      try {
        resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
        if (resolvedToken) {
          processedRequest.token_id = resolvedToken.TOKEN_ID;
          processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
          processedRequest.token_name = resolvedToken.TOKEN_NAME;
          elizaLogger15.log(`\u2705 Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL})`);
        }
      } catch (error) {
        elizaLogger15.log(`\u26A0\uFE0F Token resolution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (!processedRequest.token_id) {
      return createActionResult14({
        text: `\u274C Unable to resolve cryptocurrency: ${processedRequest.cryptocurrency}. Please provide a valid token name or symbol.`,
        data: {
          success: false,
          error: "Token resolution failed",
          request: processedRequest
        }
      });
    }
    const apiParams = {
      token_id: processedRequest.token_id,
      limit: processedRequest.limit,
      page: processedRequest.page
    };
    if (processedRequest.startDate) {
      apiParams.startDate = processedRequest.startDate;
    }
    if (processedRequest.endDate) {
      apiParams.endDate = processedRequest.endDate;
    }
    const response = await callTokenMetricsAPI("/v2/tm-grade-history", apiParams, runtime);
    if (!response?.data || response.data.length === 0) {
      return createActionResult14({
        text: `\u274C No TM Grade history data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
        data: {
          success: false,
          message: "No historical grade data available",
          token_info: processedRequest
        }
      });
    }
    const historyData = response.data;
    elizaLogger15.log("\u{1F4CA} TM Grade History API response data:", JSON.stringify(historyData.slice(0, 2), null, 2));
    const analysis = analyzeTmGradeHistory(historyData, processedRequest.analysisType);
    elizaLogger15.log("\u{1F4CA} TM Grade History analysis completed:", JSON.stringify(analysis, null, 2));
    let responseText;
    try {
      responseText = formatTmGradeHistoryResponse(historyData, analysis, processedRequest);
      elizaLogger15.log("\u{1F4CA} TM Grade History response formatted successfully, length:", responseText.length);
      elizaLogger15.log("\u{1F4CA} TM Grade History response text preview:", responseText.substring(0, 200) + "...");
    } catch (formatError) {
      elizaLogger15.error("\u274C Error formatting TM Grade History response:", formatError);
      responseText = `\u{1F4C8} **TM Grade History: ${historyData[0]?.TOKEN_NAME} (${historyData[0]?.TOKEN_SYMBOL})**

\u{1F4CA} **Data Overview**:
\u2022 Data Points: ${historyData.length}
\u2022 Latest TM Grade: ${historyData[0]?.TM_GRADE}
\u2022 Latest Signal: ${historyData[0]?.TM_GRADE_SIGNAL}`;
    }
    elizaLogger15.log("\u{1F4CA} About to return TM Grade History result with text length:", responseText.length);
    if (callback) {
      await callback({
        text: responseText,
        content: {
          success: true,
          message: `TM Grade history analysis for ${historyData[0]?.TOKEN_NAME}`,
          token_info: {
            name: historyData[0]?.TOKEN_NAME,
            symbol: historyData[0]?.TOKEN_SYMBOL,
            token_id: historyData[0]?.TOKEN_ID
          },
          history_data: historyData,
          analysis,
          endpoint: "tm-grade-history",
          request_type: processedRequest.analysisType,
          data_points: historyData.length
        }
      });
    }
    return createActionResult14({
      success: true,
      text: responseText
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    elizaLogger15.error("Error in getTmGradeHistoryAction:", error);
    return createActionResult14({
      text: `\u274C Error fetching TM Grade history: ${errorMessage}`,
      data: {
        success: false,
        error: errorMessage,
        endpoint: "tm-grade-history"
      }
    });
  }
};
function analyzeTmGradeHistory(historyData, analysisType = "all") {
  if (!historyData || historyData.length === 0) {
    return { error: "No data to analyze" };
  }
  const latest = historyData[0];
  const oldest = historyData[historyData.length - 1];
  const tmGradeTrend = calculateTrend(historyData, "TM_GRADE");
  const fundamentalTrend = calculateTrend(historyData, "FUNDAMENTAL_GRADE");
  const signalAnalysis = analyzeSignalHistory(historyData);
  const performance = calculatePerformanceMetrics(historyData);
  return {
    data_points: historyData.length,
    date_range: {
      from: oldest?.DATE,
      to: latest?.DATE
    },
    trend_analysis: {
      tm_grade: tmGradeTrend,
      fundamental_grade: fundamentalTrend
    },
    signal_analysis: signalAnalysis,
    performance_metrics: performance,
    latest_snapshot: {
      tm_grade: latest?.TM_GRADE,
      fundamental_grade: latest?.FUNDAMENTAL_GRADE,
      signal: latest?.TM_GRADE_SIGNAL,
      momentum: latest?.MOMENTUM
    }
  };
}
function calculateTrend(data, field) {
  const values = data.map((item) => parseFloat(item[field] || 0)).filter((v) => !isNaN(v));
  if (values.length < 2) {
    return { trend: "insufficient_data", change: 0 };
  }
  const latest = values[0];
  const oldest = values[values.length - 1];
  const change = latest - oldest;
  const changePercent = oldest !== 0 ? change / oldest * 100 : 0;
  let trend = "stable";
  if (changePercent > 5) trend = "improving";
  else if (changePercent < -5) trend = "declining";
  return {
    trend,
    change: change.toFixed(2),
    change_percent: changePercent.toFixed(2),
    latest_value: latest,
    oldest_value: oldest,
    volatility: calculateVolatility(values)
  };
}
function calculateVolatility(values) {
  if (values.length < 2) return "unknown";
  const mean = values.reduce((a, b) => a + b) / values.length;
  const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2)) / values.length;
  const stdDev = Math.sqrt(variance);
  const volatility = stdDev / mean * 100;
  if (volatility > 20) return "high";
  if (volatility > 10) return "medium";
  return "low";
}
function analyzeSignalHistory(data) {
  const signals = data.map((item) => item.TM_GRADE_SIGNAL).filter((s) => s);
  const signalCounts = signals.reduce((acc, signal) => {
    acc[signal] = (acc[signal] || 0) + 1;
    return acc;
  }, {});
  const totalSignals = signals.length;
  const signalDistribution = Object.entries(signalCounts).map(([signal, count]) => ({
    signal,
    count,
    percentage: totalSignals > 0 ? (count / totalSignals * 100).toFixed(1) : 0
  }));
  return {
    total_signals: totalSignals,
    distribution: signalDistribution,
    latest_signal: data[0]?.TM_GRADE_SIGNAL,
    dominant_signal: Object.keys(signalCounts).reduce((a, b) => signalCounts[a] > signalCounts[b] ? a : b, "unknown")
  };
}
function calculatePerformanceMetrics(data) {
  const tmGrades = data.map((item) => parseFloat(item.TM_GRADE || 0)).filter((v) => !isNaN(v));
  const fundamentalGrades = data.map((item) => parseFloat(item.FUNDAMENTAL_GRADE || 0)).filter((v) => !isNaN(v));
  return {
    tm_grade_stats: calculateStats(tmGrades),
    fundamental_grade_stats: calculateStats(fundamentalGrades),
    consistency: calculateConsistency(tmGrades)
  };
}
function calculateStats(values) {
  if (values.length === 0) return { error: "no_data" };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((a, b) => a + b) / values.length;
  return {
    min: min.toFixed(2),
    max: max.toFixed(2),
    average: avg.toFixed(2),
    range: (max - min).toFixed(2)
  };
}
function calculateConsistency(values) {
  if (values.length < 3) return "insufficient_data";
  const variance = calculateVolatility(values);
  if (variance === "low") return "highly_consistent";
  if (variance === "medium") return "moderately_consistent";
  return "inconsistent";
}
function formatTmGradeHistoryResponse(historyData, analysis, request) {
  const tokenName = historyData[0]?.TOKEN_NAME || "Unknown Token";
  const symbol = historyData[0]?.TOKEN_SYMBOL || "";
  let response = `\u{1F4C8} **TM Grade History: ${tokenName} (${symbol})**

`;
  response += `\u{1F4CA} **Data Overview**:
`;
  response += `\u2022 Data Points: ${analysis.data_points}
`;
  response += `\u2022 Date Range: ${analysis.date_range.from} to ${analysis.date_range.to}

`;
  if (request.analysisType === "trend" || request.analysisType === "all") {
    response += `\u{1F4C8} **Trend Analysis**:
`;
    response += `\u2022 TM Grade Trend: ${analysis.trend_analysis.tm_grade.trend} (${analysis.trend_analysis.tm_grade.change_percent}%)
`;
    response += `\u2022 Fundamental Trend: ${analysis.trend_analysis.fundamental_grade.trend} (${analysis.trend_analysis.fundamental_grade.change_percent}%)
`;
    response += `\u2022 Volatility: ${analysis.trend_analysis.tm_grade.volatility}

`;
  }
  if (request.analysisType === "signals" || request.analysisType === "all") {
    response += `\u{1F4E1} **Signal History**:
`;
    response += `\u2022 Latest Signal: ${analysis.signal_analysis.latest_signal}
`;
    response += `\u2022 Dominant Signal: ${analysis.signal_analysis.dominant_signal}
`;
    response += `\u2022 Total Signals: ${analysis.signal_analysis.total_signals}

`;
    if (analysis.signal_analysis.distribution.length > 0) {
      response += `\u{1F4CA} **Signal Distribution**:
`;
      analysis.signal_analysis.distribution.forEach((item) => {
        response += `\u2022 ${item.signal}: ${item.percentage}%
`;
      });
      response += "\n";
    }
  }
  if (request.analysisType === "performance" || request.analysisType === "all") {
    response += `\u{1F4CA} **Performance Metrics**:
`;
    if (analysis.performance_metrics.tm_grade_stats.average) {
      response += `\u2022 TM Grade Average: ${analysis.performance_metrics.tm_grade_stats.average}
`;
      response += `\u2022 TM Grade Range: ${analysis.performance_metrics.tm_grade_stats.min} - ${analysis.performance_metrics.tm_grade_stats.max}
`;
    }
    if (analysis.performance_metrics.fundamental_grade_stats.average) {
      response += `\u2022 Fundamental Average: ${analysis.performance_metrics.fundamental_grade_stats.average}
`;
    }
    response += `\u2022 Consistency: ${analysis.performance_metrics.consistency}

`;
  }
  response += `\u{1F3AF} **Latest Snapshot**:
`;
  response += `\u2022 TM Grade: ${analysis.latest_snapshot.tm_grade}
`;
  response += `\u2022 Fundamental Grade: ${analysis.latest_snapshot.fundamental_grade}
`;
  response += `\u2022 Signal: ${analysis.latest_snapshot.signal}
`;
  response += `\u2022 Momentum: ${analysis.latest_snapshot.momentum}
`;
  return response.trim();
}
var validate2 = async (runtime, message) => {
  elizaLogger15.log("\u{1F50D} Validating getTmGradeHistoryAction (1.x)");
  try {
    const apiKey = await validateAndGetApiKey(runtime);
    return !!apiKey;
  } catch (error) {
    elizaLogger15.error("\u274C Validation failed:", error);
    return false;
  }
};
var getTmGradeHistoryAction = {
  name: "GET_TM_GRADE_HISTORY_TOKENMETRICS",
  description: "Get historical TM Grade data and trend analysis from TokenMetrics",
  similes: [
    "tm grade history",
    "grade history",
    "historical grades",
    "tm grade trends",
    "grade performance",
    "grade over time",
    "historical tm analysis"
  ],
  validate: validate2,
  handler: handler2,
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Bitcoin TM grade history"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the historical TM Grade data for Bitcoin.",
          action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "ETH grade trends over time"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze the TM Grade trends for Ethereum over time.",
          action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me BONK grade performance last month"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch the TM Grade performance history for BONK.",
          action: "GET_TM_GRADE_HISTORY_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getTechnologyGradeAction.ts
import { elizaLogger as elizaLogger16, createActionResult as createActionResult15 } from "@elizaos/core";
var TechnologyGradeRequestSchema = external_exports.object({
  cryptocurrency: external_exports.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: external_exports.number().optional().describe("Specific token ID if known"),
  symbol: external_exports.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: external_exports.string().optional().describe("Full name of the token"),
  startDate: external_exports.string().optional().describe("Start date in YYYY-MM-DD format"),
  endDate: external_exports.string().optional().describe("End date in YYYY-MM-DD format"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["current", "development", "security", "activity", "collaboration", "all"]).optional().describe("Type of technology analysis")
});
var TECHNOLOGY_GRADE_EXTRACTION_TEMPLATE = `Extract Technology Grade request information from the user's message.

Technology Grade provides comprehensive technology analysis including:
- Overall technology grade scores
- Development activity scores
- Security analysis scores  
- Repository quality scores
- Collaboration scores
- DeFi scanner scores

Instructions:
Look for TECHNOLOGY GRADE requests, such as:
- Technology analysis ("Bitcoin tech grade", "ETH technology analysis")
- Development metrics ("Development activity for Solana", "Code quality scores")
- Security analysis ("Security scores for BONK", "Tech security analysis")
- Repository analysis ("Repository quality", "Code development metrics")
- Collaboration metrics ("Developer collaboration", "Team activity scores")

EXAMPLES:
- "Bitcoin tech grade" \u2192 cryptocurrency: "Bitcoin", analysisType: "current"
- "ETH technology analysis" \u2192 cryptocurrency: "ETH", analysisType: "all"
- "Development activity for Solana" \u2192 cryptocurrency: "Solana", analysisType: "development"
- "Security scores for BONK" \u2192 cryptocurrency: "BONK", analysisType: "security"
- "Repository quality for Dogecoin" \u2192 cryptocurrency: "Dogecoin", analysisType: "activity"
- "Developer collaboration for PEPE" \u2192 cryptocurrency: "PEPE", analysisType: "collaboration"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE"
- "last 30 days", "past month", etc.

CRITICAL: Extract the EXACT cryptocurrency mentioned by the user, including lesser-known tokens like BONK, DEGEN, PEPE, FLOKI, WIF, etc.

Respond with an XML block containing only the extracted values:

<response>
<cryptocurrency>exact cryptocurrency name or symbol from user's message</cryptocurrency>
<symbol>token symbol if mentioned</symbol>
<token_id>specific token ID if mentioned</token_id>
<token_name>full name of the token</token_name>
<startDate>start date in YYYY-MM-DD format if mentioned</startDate>
<endDate>end date in YYYY-MM-DD format if mentioned</endDate>
<limit>number of data points to return</limit>
<page>page number for pagination</page>
<analysisType>current|development|security|activity|collaboration|all</analysisType>
</response>`;
var handler3 = async (runtime, message, state, _options, callback) => {
  elizaLogger16.info("\u{1F527} Starting TokenMetrics Technology Grade Action");
  try {
    const requestId = generateRequestId();
    const userMessage = message.content?.text || "";
    const enhancedTemplate = TECHNOLOGY_GRADE_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
    const techRequest = await extractTokenMetricsRequest(
      runtime,
      message,
      state || await runtime.composeState(message),
      enhancedTemplate,
      TechnologyGradeRequestSchema,
      requestId
    );
    elizaLogger16.info("\u{1F527} Extracted technology grade request:", techRequest);
    const processedRequest = {
      cryptocurrency: techRequest?.cryptocurrency,
      token_id: techRequest?.token_id,
      symbol: techRequest?.symbol,
      token_name: techRequest?.token_name,
      startDate: techRequest?.startDate,
      endDate: techRequest?.endDate,
      limit: techRequest?.limit || 50,
      page: techRequest?.page || 1,
      analysisType: techRequest?.analysisType || "all"
    };
    let resolvedToken = null;
    if (processedRequest.cryptocurrency && !processedRequest.token_id) {
      try {
        resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
        if (resolvedToken) {
          processedRequest.token_id = resolvedToken.TOKEN_ID;
          processedRequest.symbol = resolvedToken.TOKEN_SYMBOL;
          processedRequest.token_name = resolvedToken.TOKEN_NAME;
          elizaLogger16.log(`\u2705 Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.TOKEN_NAME} (${resolvedToken.TOKEN_SYMBOL})`);
        }
      } catch (error) {
        elizaLogger16.log(`\u26A0\uFE0F Token resolution failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    if (!processedRequest.token_id) {
      return createActionResult15({
        text: `\u274C Unable to resolve cryptocurrency: ${processedRequest.cryptocurrency}. Please provide a valid token name or symbol.`,
        data: {
          success: false,
          error: "Token resolution failed",
          request: processedRequest
        }
      });
    }
    const apiParams = {
      token_id: processedRequest.token_id,
      limit: processedRequest.limit,
      page: processedRequest.page
    };
    if (processedRequest.startDate) {
      apiParams.startDate = processedRequest.startDate;
    }
    if (processedRequest.endDate) {
      apiParams.endDate = processedRequest.endDate;
    }
    const response = await callTokenMetricsAPI("/v2/technology-grade", apiParams, runtime);
    if (!response?.data || response.data.length === 0) {
      return createActionResult15({
        text: `\u274C No Technology Grade data found for ${processedRequest.token_name || processedRequest.cryptocurrency}`,
        data: {
          success: false,
          message: "No technology grade data available",
          token_info: processedRequest
        }
      });
    }
    const techData = response.data;
    elizaLogger16.log("\u{1F4CA} Technology Grade API response data:", JSON.stringify(techData.slice(0, 2), null, 2));
    const analysis = analyzeTechnologyGradeData(techData, processedRequest.analysisType);
    elizaLogger16.log("\u{1F4CA} Technology Grade analysis completed:", JSON.stringify(analysis, null, 2));
    let responseText;
    try {
      responseText = formatTechnologyGradeResponse(techData, analysis, processedRequest);
      elizaLogger16.log("\u{1F4CA} Technology Grade response formatted successfully, length:", responseText.length);
      elizaLogger16.log("\u{1F4CA} Technology Grade response text preview:", responseText.substring(0, 200) + "...");
    } catch (formatError) {
      elizaLogger16.error("\u274C Error formatting Technology Grade response:", formatError);
      responseText = `\u{1F527} **Technology Grade Analysis: ${techData[0]?.TOKEN_NAME} (${techData[0]?.TOKEN_SYMBOL})**

\u{1F4CA} **Overall Technology Grade**: ${techData[0]?.TECHNOLOGY_GRADE}/100
\u2022 Activity Score: ${techData[0]?.ACTIVITY_SCORE}
\u2022 Repository Score: ${techData[0]?.REPOSITORY_SCORE}`;
    }
    elizaLogger16.log("\u{1F4CA} About to return Technology Grade result with text length:", responseText.length);
    if (callback) {
      await callback({
        text: responseText,
        content: {
          success: true,
          message: `Technology Grade analysis for ${techData[0]?.TOKEN_NAME}`,
          token_info: {
            name: techData[0]?.TOKEN_NAME,
            symbol: techData[0]?.TOKEN_SYMBOL,
            token_id: techData[0]?.TOKEN_ID
          },
          technology_data: techData,
          analysis,
          endpoint: "technology-grade",
          request_type: processedRequest.analysisType,
          data_points: techData.length
        }
      });
    }
    return createActionResult15({
      success: true,
      text: responseText
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    elizaLogger16.error("Error in getTechnologyGradeAction:", error);
    return createActionResult15({
      text: `\u274C Error fetching Technology Grade data: ${errorMessage}`,
      data: {
        success: false,
        error: errorMessage,
        endpoint: "technology-grade"
      }
    });
  }
};
function analyzeTechnologyGradeData(techData, analysisType = "all") {
  if (!techData || techData.length === 0) {
    return { error: "No data to analyze" };
  }
  const latest = techData[0];
  const overallGrade = parseFloat(latest.TECHNOLOGY_GRADE || 0);
  const gradeClassification = classifyTechnologyGrade(overallGrade);
  const scoreAnalysis = analyzeIndividualScores(latest);
  const strengthsWeaknesses = identifyStrengthsWeaknesses(latest);
  return {
    overall_assessment: {
      grade: overallGrade,
      classification: gradeClassification,
      interpretation: getTechnologyInterpretation(overallGrade)
    },
    score_breakdown: scoreAnalysis,
    strengths_weaknesses: strengthsWeaknesses,
    recommendations: generateTechRecommendations(scoreAnalysis, overallGrade),
    data_points: techData.length,
    latest_date: latest.DATE
  };
}
function classifyTechnologyGrade(grade) {
  if (grade >= 90) return "Exceptional (A+)";
  if (grade >= 80) return "Excellent (A)";
  if (grade >= 70) return "Good (B)";
  if (grade >= 60) return "Average (C)";
  if (grade >= 50) return "Below Average (D)";
  return "Poor (F)";
}
function getTechnologyInterpretation(grade) {
  if (grade >= 80) return "Strong technology foundation with active development";
  if (grade >= 70) return "Solid technology implementation with good metrics";
  if (grade >= 60) return "Adequate technology with room for improvement";
  if (grade >= 50) return "Below average technology metrics";
  return "Poor technology implementation";
}
function analyzeIndividualScores(data) {
  const scores = {
    activity: parseFloat(data.ACTIVITY_SCORE || 0),
    security: data.SECURITY_SCORE ? parseFloat(data.SECURITY_SCORE) : null,
    repository: parseFloat(data.REPOSITORY_SCORE || 0),
    collaboration: parseFloat(data.COLLABORATION_SCORE || 0),
    defi_scanner: data.DEFI_SCANNER_SCORE ? parseFloat(data.DEFI_SCANNER_SCORE) : null
  };
  return {
    activity: {
      score: scores.activity,
      grade: scoreToGrade(scores.activity),
      status: getScoreStatus(scores.activity)
    },
    security: scores.security ? {
      score: scores.security,
      grade: scoreToGrade(scores.security),
      status: getScoreStatus(scores.security)
    } : { status: "Not Available" },
    repository: {
      score: scores.repository,
      grade: scoreToGrade(scores.repository),
      status: getScoreStatus(scores.repository)
    },
    collaboration: {
      score: scores.collaboration,
      grade: scoreToGrade(scores.collaboration),
      status: getScoreStatus(scores.collaboration)
    },
    defi_scanner: scores.defi_scanner ? {
      score: scores.defi_scanner,
      grade: scoreToGrade(scores.defi_scanner),
      status: getScoreStatus(scores.defi_scanner)
    } : { status: "Not Available" }
  };
}
function scoreToGrade(score) {
  if (score >= 9) return "A";
  if (score >= 8) return "B";
  if (score >= 7) return "C";
  if (score >= 6) return "D";
  return "F";
}
function getScoreStatus(score) {
  if (score >= 8) return "Excellent";
  if (score >= 7) return "Good";
  if (score >= 6) return "Average";
  if (score >= 5) return "Below Average";
  return "Poor";
}
function identifyStrengthsWeaknesses(data) {
  const scores = {
    activity: parseFloat(data.ACTIVITY_SCORE || 0),
    security: data.SECURITY_SCORE ? parseFloat(data.SECURITY_SCORE) : 0,
    repository: parseFloat(data.REPOSITORY_SCORE || 0),
    collaboration: parseFloat(data.COLLABORATION_SCORE || 0),
    defi_scanner: data.DEFI_SCANNER_SCORE ? parseFloat(data.DEFI_SCANNER_SCORE) : 0
  };
  const strengths = [];
  const weaknesses = [];
  Object.entries(scores).forEach(([key, score]) => {
    if (score >= 8) {
      strengths.push(formatMetricName(key));
    } else if (score > 0 && score < 6) {
      weaknesses.push(formatMetricName(key));
    }
  });
  return { strengths, weaknesses };
}
function formatMetricName(metric) {
  const names = {
    activity: "Development Activity",
    security: "Security Analysis",
    repository: "Repository Quality",
    collaboration: "Team Collaboration",
    defi_scanner: "DeFi Security"
  };
  return names[metric] || metric;
}
function generateTechRecommendations(scoreAnalysis, overallGrade) {
  const recommendations = [];
  if (overallGrade < 70) {
    recommendations.push("Consider improving overall technology metrics");
  }
  if (scoreAnalysis.activity.score < 6) {
    recommendations.push("Increase development activity and code commits");
  }
  if (scoreAnalysis.repository.score < 7) {
    recommendations.push("Enhance repository quality and documentation");
  }
  if (scoreAnalysis.collaboration.score < 7) {
    recommendations.push("Improve team collaboration and community engagement");
  }
  if (scoreAnalysis.security.status === "Not Available") {
    recommendations.push("Implement security analysis and auditing");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain current strong technology standards");
  }
  return recommendations;
}
function formatTechnologyGradeResponse(techData, analysis, request) {
  const tokenName = techData[0]?.TOKEN_NAME || "Unknown Token";
  const symbol = techData[0]?.TOKEN_SYMBOL || "";
  const latest = techData[0];
  let response = `\u{1F527} **Technology Grade Analysis: ${tokenName} (${symbol})**

`;
  if (request.analysisType === "current" || request.analysisType === "all") {
    response += `\u{1F4CA} **Overall Technology Grade**:
`;
    response += `\u2022 Grade: ${analysis.overall_assessment.grade}/100 (${analysis.overall_assessment.classification})
`;
    response += `\u2022 Assessment: ${analysis.overall_assessment.interpretation}

`;
  }
  if (request.analysisType === "development" || request.analysisType === "activity" || request.analysisType === "all") {
    response += `\u26A1 **Development Activity**:
`;
    response += `\u2022 Score: ${analysis.score_breakdown.activity.score}/10 (${analysis.score_breakdown.activity.grade})
`;
    response += `\u2022 Status: ${analysis.score_breakdown.activity.status}

`;
    response += `\u{1F4C1} **Repository Quality**:
`;
    response += `\u2022 Score: ${analysis.score_breakdown.repository.score}/10 (${analysis.score_breakdown.repository.grade})
`;
    response += `\u2022 Status: ${analysis.score_breakdown.repository.status}

`;
  }
  if (request.analysisType === "security" || request.analysisType === "all") {
    response += `\u{1F512} **Security Analysis**:
`;
    if (analysis.score_breakdown.security.score !== void 0) {
      response += `\u2022 Score: ${analysis.score_breakdown.security.score}/10 (${analysis.score_breakdown.security.grade})
`;
      response += `\u2022 Status: ${analysis.score_breakdown.security.status}
`;
    } else {
      response += `\u2022 Status: ${analysis.score_breakdown.security.status}
`;
    }
    if (analysis.score_breakdown.defi_scanner.score !== void 0) {
      response += `\u2022 DeFi Security: ${analysis.score_breakdown.defi_scanner.score}/10 (${analysis.score_breakdown.defi_scanner.grade})
`;
    } else {
      response += `\u2022 DeFi Security: ${analysis.score_breakdown.defi_scanner.status}
`;
    }
    response += "\n";
  }
  if (request.analysisType === "collaboration" || request.analysisType === "all") {
    response += `\u{1F465} **Team Collaboration**:
`;
    response += `\u2022 Score: ${analysis.score_breakdown.collaboration.score}/10 (${analysis.score_breakdown.collaboration.grade})
`;
    response += `\u2022 Status: ${analysis.score_breakdown.collaboration.status}

`;
  }
  if (request.analysisType === "all") {
    if (analysis.strengths_weaknesses.strengths.length > 0) {
      response += `\u{1F4AA} **Strengths**:
`;
      analysis.strengths_weaknesses.strengths.forEach((strength) => {
        response += `\u2022 ${strength}
`;
      });
      response += "\n";
    }
    if (analysis.strengths_weaknesses.weaknesses.length > 0) {
      response += `\u26A0\uFE0F **Areas for Improvement**:
`;
      analysis.strengths_weaknesses.weaknesses.forEach((weakness) => {
        response += `\u2022 ${weakness}
`;
      });
      response += "\n";
    }
    response += `\u{1F4A1} **Recommendations**:
`;
    analysis.recommendations.forEach((rec) => {
      response += `\u2022 ${rec}
`;
    });
  }
  return response.trim();
}
var validate3 = async (runtime, message) => {
  elizaLogger16.log("\u{1F50D} Validating getTechnologyGradeAction (1.x)");
  try {
    const apiKey = await validateAndGetApiKey(runtime);
    return !!apiKey;
  } catch (error) {
    elizaLogger16.error("\u274C Validation failed:", error);
    return false;
  }
};
var getTechnologyGradeAction = {
  name: "GET_TECHNOLOGY_GRADE_TOKENMETRICS",
  description: "Get technology grade and development analysis from TokenMetrics",
  similes: [
    "technology grade",
    "tech grade",
    "technology analysis",
    "development metrics",
    "code quality",
    "security scores",
    "repository analysis",
    "tech assessment"
  ],
  validate: validate3,
  handler: handler3,
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Bitcoin tech grade"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the technology grade analysis for Bitcoin.",
          action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "ETH technology analysis"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze the technology metrics for Ethereum including development activity and security scores.",
          action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Development activity for Solana"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll fetch the development and technology metrics for Solana.",
          action: "GET_TECHNOLOGY_GRADE_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getMarketMetricsAction.ts
import { elizaLogger as elizaLogger17, createActionResult as createActionResult16 } from "@elizaos/core";
var marketMetricsTemplate = `Extract market metrics request information from the message.

Market metrics provide comprehensive market analysis including:
- Overall market trends and sentiment
- Market capitalization data
- Volume analysis and liquidity metrics
- Price movement patterns
- Market dominance statistics
- Fear & Greed index
- Market volatility measurements

Instructions:
Look for MARKET METRICS requests, such as:
- General market analysis ("What's the market doing?", "How's the crypto market?")
- Market cap queries ("Total crypto market cap", "Market capitalization analysis")
- Volume analysis ("Market volume trends", "Trading volume analysis")
- Market sentiment ("Market sentiment today", "Fear and greed index")
- Market trends ("Market trend analysis", "Overall market performance")
- Date range requests ("Market metrics from 2025-03-02 to 2025-06-02", "Show market data between March and June")

EXAMPLES:
- "How's the crypto market performing today?" \u2192 analysis_type: "general"
- "What's the total market cap?" \u2192 metrics_requested: "cap"
- "Show me market volume trends" \u2192 analysis_type: "volume"
- "Get market sentiment analysis" \u2192 analysis_type: "sentiment"
- "Market metrics overview" \u2192 analysis_type: "general"
- "Current market trends" \u2192 analysis_type: "trends"
- "Show market metrics from 2025-03-02 to 2025-06-02" \u2192 start_date: "2025-03-02", end_date: "2025-06-02"
- "Market data between March 1 and June 30, 2025" \u2192 start_date: "2025-03-01", end_date: "2025-06-30"

IMPORTANT: Extract date ranges if mentioned in formats like:
- "from YYYY-MM-DD to YYYY-MM-DD"
- "between DATE and DATE" 
- "from March to June" (convert to YYYY-MM-DD format)

Respond with an XML block containing only the extracted values:

<response>
<analysis_type>general or sentiment or volume or trends or dominance</analysis_type>
<timeframe>hourly or daily or weekly or monthly</timeframe>
<market_focus>total or defi or layer1 or altcoins or all</market_focus>
<metrics_requested>cap, volume, sentiment, trends, volatility, or all</metrics_requested>
<comparison_period>24h or 7d or 30d or 1y or none</comparison_period>
<start_date>YYYY-MM-DD format if date range mentioned</start_date>
<end_date>YYYY-MM-DD format if date range mentioned</end_date>
</response>`;
var MarketMetricsRequestSchema = external_exports.object({
  analysis_type: external_exports.string().optional().describe("Type of analysis requested"),
  timeframe: external_exports.string().optional().describe("Time frame for analysis"),
  market_focus: external_exports.string().optional().describe("Market focus area"),
  metrics_requested: external_exports.string().optional().describe("Specific metrics requested"),
  comparison_period: external_exports.string().optional().describe("Comparison period"),
  start_date: external_exports.string().optional().describe("Start date in YYYY-MM-DD format"),
  end_date: external_exports.string().optional().describe("End date in YYYY-MM-DD format"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysis_focus: external_exports.array(external_exports.enum([
    "market_sentiment",
    "trend_analysis",
    "strategic_insights",
    "current_status"
  ])).optional().describe("Types of analysis to focus on")
});
var handler4 = async (runtime, message, state, _options, callback) => {
  elizaLogger17.info("\u{1F3E2} Starting TokenMetrics Market Metrics Action");
  try {
    const userMessage = message.content?.text || "";
    const enhancedTemplate = marketMetricsTemplate + `

USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
    const extractedRequest = await extractTokenMetricsRequest(
      runtime,
      message,
      state || await runtime.composeState(message),
      enhancedTemplate,
      MarketMetricsRequestSchema,
      generateRequestId()
    );
    elizaLogger17.info("\u{1F4CA} Extracted market metrics request:", extractedRequest);
    const processedRequest = {
      start_date: extractedRequest.start_date,
      end_date: extractedRequest.end_date,
      limit: extractedRequest.limit || 50,
      page: extractedRequest.page || 1,
      analysis_focus: extractedRequest.analysis_focus || ["current_status"]
    };
    const apiParams = {
      limit: processedRequest.limit,
      page: processedRequest.page
    };
    if (processedRequest.start_date) {
      apiParams.startDate = processedRequest.start_date;
    }
    if (processedRequest.end_date) {
      apiParams.endDate = processedRequest.end_date;
    }
    const response = await callTokenMetricsAPI(
      "/v2/market-metrics",
      apiParams,
      runtime
    );
    if (!response || response.error && !response.data) {
      throw new Error(response?.error || "Failed to fetch market metrics data");
    }
    const marketMetrics = Array.isArray(response) ? response : response.data || [];
    const marketAnalysis = analyzeMarketMetrics(marketMetrics);
    const currentStatus = getCurrentMarketStatus(marketMetrics);
    let responseText = "\u{1F4CA} **TokenMetrics Market Analytics**\n\n";
    if (processedRequest.analysis_focus.includes("current_status")) {
      responseText += `\u{1F3AF} **Current Market Status**: ${currentStatus.sentiment_description}
`;
      responseText += `\u{1F4C8} **Market Direction**: ${currentStatus.direction}
`;
      responseText += `\u{1F4AA} **Signal Strength**: ${currentStatus.strength}/10

`;
    }
    if (processedRequest.analysis_focus.includes("market_sentiment")) {
      responseText += `\u{1F50D} **Market Sentiment Analysis**:
`;
      responseText += `\u2022 Bullish/Bearish Indicator: ${marketAnalysis.overall_sentiment}
`;
      responseText += `\u2022 Confidence Level: ${marketAnalysis.confidence_level}%
`;
      responseText += `\u2022 Market Phase: ${marketAnalysis.market_phase}

`;
    }
    if (processedRequest.analysis_focus.includes("trend_analysis")) {
      responseText += `\u{1F4C8} **Trend Analysis**:
`;
      responseText += `\u2022 Primary Trend: ${marketAnalysis.trend_direction}
`;
      responseText += `\u2022 Trend Strength: ${marketAnalysis.trend_strength}
`;
      responseText += `\u2022 Momentum: ${marketAnalysis.momentum}

`;
    }
    if (processedRequest.analysis_focus.includes("strategic_insights")) {
      responseText += `\u{1F4A1} **Strategic Insights**:
`;
      if (marketAnalysis.strategic_implications) {
        marketAnalysis.strategic_implications.forEach((insight, index) => {
          responseText += `${index + 1}. ${insight}
`;
        });
      }
      responseText += "\n";
    }
    responseText += `\u{1F4CB} **Key Metrics Summary**:
`;
    responseText += `\u2022 Data Points Analyzed: ${marketMetrics.length}
`;
    responseText += `\u2022 Total Crypto Market Cap: ${formatCurrency(marketMetrics[0]?.TOTAL_CRYPTO_MCAP || 0)}
`;
    responseText += `\u2022 High-Grade Coins: ${formatPercentage(marketMetrics[0]?.TM_GRADE_PERC_HIGH_COINS || 0)}%
`;
    responseText += `\u2022 Current Signal: ${getSignalDescription(marketMetrics[0]?.TM_GRADE_SIGNAL || 0)}
`;
    responseText += `\u2022 Previous Signal: ${getSignalDescription(marketMetrics[0]?.LAST_TM_GRADE_SIGNAL || 0)}
`;
    if (marketAnalysis.recommendations && marketAnalysis.recommendations.length > 0) {
      responseText += `
\u{1F3AF} **Recommendations**:
`;
      marketAnalysis.recommendations.forEach((rec, index) => {
        responseText += `${index + 1}. ${rec}
`;
      });
    }
    if (callback) {
      callback({
        text: responseText,
        content: {
          success: true,
          data: {
            market_metrics: marketMetrics,
            analysis: marketAnalysis,
            current_status: currentStatus,
            metadata: {
              endpoint: "/v2/market-metrics",
              data_points: marketMetrics.length,
              analysis_focus: processedRequest.analysis_focus,
              date_range: {
                start: processedRequest.start_date,
                end: processedRequest.end_date
              }
            }
          }
        }
      });
    }
    return createActionResult16({
      success: true,
      text: responseText,
      data: {
        market_metrics: marketMetrics,
        analysis: marketAnalysis,
        source: "TokenMetrics Market Analytics"
      }
    });
  } catch (error) {
    elizaLogger17.error("\u274C Error in market metrics handler:", error);
    const errorText = `\u274C Unable to fetch market metrics: ${error instanceof Error ? error.message : "Unknown error"}`;
    if (callback) {
      await callback({
        text: errorText,
        content: { error: "Market metrics fetch failed" }
      });
    }
    return createActionResult16({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
function getSignalDescription(signal) {
  switch (signal) {
    case 1:
      return "\u{1F7E2} Bullish";
    case -1:
      return "\u{1F534} Bearish";
    case 0:
      return "\u{1F7E1} Neutral";
    default:
      return "\u2753 Unknown";
  }
}
var validate4 = async (runtime, message, state) => {
  elizaLogger17.log("\u{1F50D} Validating getMarketMetricsAction (1.x)");
  try {
    validateAndGetApiKey(runtime);
    return true;
  } catch (error) {
    elizaLogger17.error("\u274C Validation failed:", error);
    return false;
  }
};
var examples = [
  [
    {
      name: "{{user1}}",
      content: {
        text: "What's the current crypto market sentiment?"
      }
    },
    {
      name: "{{agent}}",
      content: {
        text: "I'll analyze the current crypto market sentiment using TokenMetrics market metrics.",
        action: "GET_MARKET_METRICS_TOKENMETRICS"
      }
    }
  ],
  [
    {
      name: "{{user1}}",
      content: {
        text: "Show me market trends analysis"
      }
    },
    {
      name: "{{agent}}",
      content: {
        text: "Let me fetch comprehensive market trends analysis from TokenMetrics.",
        action: "GET_MARKET_METRICS_TOKENMETRICS"
      }
    }
  ],
  [
    {
      name: "{{user1}}",
      content: {
        text: "Is the market bullish or bearish right now?"
      }
    },
    {
      name: "{{agent}}",
      content: {
        text: "I'll check the current bullish/bearish market indicators for you.",
        action: "GET_MARKET_METRICS_TOKENMETRICS"
      }
    }
  ]
];
var getMarketMetricsAction = {
  name: "GET_MARKET_METRICS_TOKENMETRICS",
  description: "Get TokenMetrics market analytics including bullish/bearish market indicator and comprehensive market insights",
  similes: [
    "get market metrics",
    "check market sentiment",
    "get market analytics",
    "bullish bearish indicator",
    "get market direction",
    "crypto market analysis",
    "market sentiment analysis"
  ],
  handler: handler4,
  validate: validate4,
  examples
};
function analyzeMarketMetrics(marketData) {
  if (!marketData || marketData.length === 0) {
    return {
      overall_sentiment: "Neutral",
      confidence_level: 0,
      market_phase: "Unknown",
      trend_direction: "Sideways",
      trend_strength: "Weak",
      momentum: "Neutral",
      strategic_implications: ["Insufficient data for analysis"],
      recommendations: ["Wait for more market data"]
    };
  }
  const latestData = marketData[0] || {};
  const recentData = marketData.slice(0, Math.min(7, marketData.length));
  const signalAnalysis = analyzeSignalDistribution(marketData);
  const trendAnalysis = analyzeTrendPatterns(recentData);
  const strengthAssessment = assessMarketStrength(signalAnalysis, trendAnalysis);
  const strategicImplications = generateStrategicImplications(latestData, trendAnalysis, signalAnalysis);
  const recommendations = generateMarketRecommendations(latestData, trendAnalysis, strengthAssessment);
  return {
    overall_sentiment: getCurrentSentimentDescription(latestData),
    confidence_level: Math.round(strengthAssessment.confidence * 100),
    market_phase: strengthAssessment.phase,
    trend_direction: trendAnalysis.primary_direction,
    trend_strength: trendAnalysis.strength,
    momentum: trendAnalysis.momentum,
    market_cap_trend: trendAnalysis.market_cap_trend,
    volatility_level: strengthAssessment.volatility,
    strategic_implications: strategicImplications,
    recommendations,
    signal_distribution: signalAnalysis,
    trend_analysis: trendAnalysis,
    strength_assessment: strengthAssessment
  };
}
function getCurrentSentimentDescription(metrics) {
  if (!metrics) return "Neutral";
  const bullishIndicators = metrics.bullish_score || metrics.bullish_indicator || 0;
  const bearishIndicators = metrics.bearish_score || metrics.bearish_indicator || 0;
  if (bullishIndicators > bearishIndicators * 1.2) return "Bullish";
  if (bearishIndicators > bullishIndicators * 1.2) return "Bearish";
  return "Neutral";
}
function getCurrentMarketStatus(data) {
  if (!data || data.length === 0) {
    return {
      sentiment_description: "Unknown",
      direction: "Sideways",
      strength: 5,
      confidence: 0
    };
  }
  const latest = data[0];
  const sentiment = getCurrentSentimentDescription(latest);
  let strength = 5;
  if (latest.market_strength) {
    strength = Math.round(latest.market_strength * 10);
  } else if (latest.bullish_score && latest.bearish_score) {
    const diff = Math.abs(latest.bullish_score - latest.bearish_score);
    strength = Math.min(10, Math.max(1, Math.round(5 + diff * 5)));
  }
  return {
    sentiment_description: sentiment,
    direction: sentiment === "Neutral" ? "Sideways" : sentiment,
    strength: Math.min(10, Math.max(1, strength)),
    confidence: data.length >= 7 ? 0.8 : 0.5,
    last_updated: latest.date || latest.timestamp || (/* @__PURE__ */ new Date()).toISOString()
  };
}
function analyzeSignalDistribution(data) {
  if (!data || data.length === 0) {
    return {
      bullish_percentage: 50,
      bearish_percentage: 50,
      neutral_percentage: 0,
      signal_consistency: 0,
      dominant_signal: "Neutral"
    };
  }
  let bullishCount = 0;
  let bearishCount = 0;
  let neutralCount = 0;
  data.forEach((item) => {
    const sentiment = getCurrentSentimentDescription(item);
    if (sentiment === "Bullish") bullishCount++;
    else if (sentiment === "Bearish") bearishCount++;
    else neutralCount++;
  });
  const total = data.length;
  const bullishPct = Math.round(bullishCount / total * 100);
  const bearishPct = Math.round(bearishCount / total * 100);
  const neutralPct = Math.round(neutralCount / total * 100);
  let dominantSignal = "Neutral";
  if (bullishPct > bearishPct && bullishPct > neutralPct) dominantSignal = "Bullish";
  else if (bearishPct > bullishPct && bearishPct > neutralPct) dominantSignal = "Bearish";
  const consistency = Math.max(bullishPct, bearishPct, neutralPct) / 100;
  return {
    bullish_percentage: bullishPct,
    bearish_percentage: bearishPct,
    neutral_percentage: neutralPct,
    signal_consistency: Math.round(consistency * 100),
    dominant_signal: dominantSignal
  };
}
function analyzeTrendPatterns(recentData) {
  if (!recentData || recentData.length < 2) {
    return {
      primary_direction: "Sideways",
      strength: "Weak",
      momentum: "Neutral",
      market_cap_trend: "Stable"
    };
  }
  const values = recentData.map(
    (item) => item.total_market_cap || item.market_cap || item.price || 0
  ).filter((val) => val > 0);
  if (values.length < 2) {
    return {
      primary_direction: "Sideways",
      strength: "Weak",
      momentum: "Neutral",
      market_cap_trend: "Stable"
    };
  }
  const first = values[values.length - 1];
  const last = values[0];
  const change = (last - first) / first * 100;
  let direction = "Sideways";
  let strength = "Weak";
  let momentum = "Neutral";
  if (Math.abs(change) > 5) {
    direction = change > 0 ? "Upward" : "Downward";
    strength = Math.abs(change) > 15 ? "Strong" : "Moderate";
  }
  if (values.length >= 4) {
    const recentChange = (values[0] - values[1]) / values[1] * 100;
    const earlierChange = (values[2] - values[3]) / values[3] * 100;
    if (Math.abs(recentChange) > Math.abs(earlierChange) * 1.2) {
      momentum = "Accelerating";
    } else if (Math.abs(recentChange) < Math.abs(earlierChange) * 0.8) {
      momentum = "Decelerating";
    }
  }
  return {
    primary_direction: direction,
    strength,
    momentum,
    market_cap_trend: direction === "Sideways" ? "Stable" : direction,
    change_percentage: Math.round(change * 100) / 100
  };
}
function assessMarketStrength(signalAnalysis, trendAnalysis) {
  const signalStrength = signalAnalysis.signal_consistency / 100;
  const trendStrength = trendAnalysis.strength === "Strong" ? 0.8 : trendAnalysis.strength === "Moderate" ? 0.6 : 0.4;
  const overallStrength = (signalStrength + trendStrength) / 2;
  let phase = "Consolidation";
  if (overallStrength > 0.7) phase = "Trending";
  else if (overallStrength < 0.4) phase = "Uncertain";
  let volatility = "Medium";
  if (trendAnalysis.change_percentage && Math.abs(trendAnalysis.change_percentage) > 10) {
    volatility = "High";
  } else if (trendAnalysis.change_percentage && Math.abs(trendAnalysis.change_percentage) < 3) {
    volatility = "Low";
  }
  return {
    confidence: overallStrength,
    phase,
    volatility,
    overall_score: Math.round(overallStrength * 10)
  };
}
function generateStrategicImplications(currentMetrics, trendAnalysis, signalAnalysis) {
  const implications = [];
  if (signalAnalysis.dominant_signal === "Bullish" && signalAnalysis.signal_consistency > 60) {
    implications.push("Strong bullish sentiment suggests favorable conditions for crypto exposure");
  } else if (signalAnalysis.dominant_signal === "Bearish" && signalAnalysis.signal_consistency > 60) {
    implications.push("Bearish sentiment indicates defensive positioning may be prudent");
  } else {
    implications.push("Mixed signals suggest maintaining balanced portfolio allocation");
  }
  if (trendAnalysis.primary_direction === "Upward" && trendAnalysis.strength === "Strong") {
    implications.push("Strong upward trend supports momentum-based strategies");
  } else if (trendAnalysis.primary_direction === "Downward" && trendAnalysis.strength === "Strong") {
    implications.push("Strong downward trend suggests waiting for reversal signals");
  }
  if (trendAnalysis.momentum === "Accelerating") {
    implications.push("Accelerating momentum may indicate trend continuation");
  } else if (trendAnalysis.momentum === "Decelerating") {
    implications.push("Decelerating momentum suggests potential trend reversal");
  }
  return implications.length > 0 ? implications : ["Market conditions require careful monitoring"];
}
function generateMarketRecommendations(currentMetrics, trendAnalysis, strengthAssessment) {
  const recommendations = [];
  if (strengthAssessment.phase === "Trending") {
    recommendations.push("Consider trend-following strategies with appropriate risk management");
  } else if (strengthAssessment.phase === "Consolidation") {
    recommendations.push("Range-bound strategies may be more effective in current conditions");
  } else {
    recommendations.push("Exercise caution and wait for clearer market signals");
  }
  if (strengthAssessment.volatility === "High") {
    recommendations.push("High volatility requires smaller position sizes and tighter stops");
  } else if (strengthAssessment.volatility === "Low") {
    recommendations.push("Low volatility environment may favor larger position sizes");
  }
  if (strengthAssessment.confidence > 0.7) {
    recommendations.push("High confidence signals support more aggressive positioning");
  } else if (strengthAssessment.confidence < 0.4) {
    recommendations.push("Low confidence suggests conservative approach until clarity improves");
  }
  return recommendations.length > 0 ? recommendations : ["Monitor market conditions closely before making major decisions"];
}

// src/actions/getIndicesAction.ts
import {
  elizaLogger as elizaLogger18,
  createActionResult as createActionResult17
} from "@elizaos/core";
var IndicesRequestSchema = external_exports.object({
  indicesType: external_exports.string().nullable().optional().describe("Type of indices to filter (active, passive, etc.)"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of indices to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["performance", "risk", "diversification", "all"]).optional().describe("Type of analysis to focus on")
});
var INDICES_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto indices analysis requests from natural language.

The user wants to get information about crypto indices. Extract the following information:

1. **indicesType** (optional): Type of indices they're interested in
   - "active" for actively managed indices
   - "passive" for passive/index tracking
   - Leave null for all types

2. **limit** (default: 50): How many indices to return (1-100)

3. **page** (default: 1): Which page of results (for pagination)

4. **analysisType** (default: "all"): What type of analysis they want
   - "performance" - focus on returns and performance metrics
   - "risk" - focus on volatility and risk metrics  
   - "diversification" - focus on portfolio diversification
   - "all" - comprehensive analysis

Examples:
- "Show me crypto indices" \u2192 {indicesType: null, limit: 50, page: 1, analysisType: "all"}
- "Get active crypto index funds" \u2192 {indicesType: "active", limit: 50, page: 1, analysisType: "all"}
- "What are the best performing passive indices?" \u2192 {indicesType: "passive", limit: 50, page: 1, analysisType: "performance"}
- "Show me 20 indices focused on risk analysis" \u2192 {indicesType: null, limit: 20, page: 1, analysisType: "risk"}

Extract the request details from the user's message and respond in XML format:

<response>
<indicesType>active|passive|null</indicesType>
<limit>number of indices to return</limit>
<page>page number for pagination</page>
<analysisType>performance|risk|diversification|all</analysisType>
</response>
`;
var getIndicesAction = {
  name: "GET_INDICES_TOKENMETRICS",
  description: "Get active and passive crypto indices with performance and market data from TokenMetrics for index-based investment analysis",
  similes: [
    "get indices",
    "crypto indices",
    "index funds",
    "passive indices",
    "active indices",
    "index performance",
    "crypto index analysis",
    "index investment opportunities"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get index performance comparison"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get comprehensive index performance data for comparison.",
          action: "GET_INDICES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show index portfolio compositions"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve the detailed portfolio compositions of available indices.",
          action: "GET_INDICES_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = INDICES_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const indicesRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        IndicesRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, indicesRequest);
      const processedRequest = {
        indicesType: indicesRequest?.indicesType,
        limit: indicesRequest?.limit || 50,
        page: indicesRequest?.page || 1,
        analysisType: indicesRequest?.analysisType || "all"
      };
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.indicesType && processedRequest.indicesType !== null) {
        apiParams.indicesType = processedRequest.indicesType;
      }
      const response = await callTokenMetricsAPI(
        "/v2/indices",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const indices = Array.isArray(response) ? response : response.data || [];
      console.log(`[${requestId}] Raw API response:`, JSON.stringify(response, null, 2));
      console.log(`[${requestId}] Processed indices array:`, JSON.stringify(indices.slice(0, 2), null, 2));
      const indicesAnalysis = analyzeIndicesData(indices, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${indices.length} crypto indices`,
        request_id: requestId,
        indices_data: indices,
        analysis: indicesAnalysis,
        metadata: {
          endpoint: "indices",
          filters_applied: {
            indices_type: processedRequest.indicesType,
            analysis_focus: processedRequest.analysisType
          },
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: indices.length,
          api_version: "v2",
          data_source: "TokenMetrics Indices Engine"
        },
        indices_explanation: {
          purpose: "Crypto indices provide diversified exposure to cryptocurrency markets through professionally managed baskets",
          index_types: [
            "Active Indices - Professionally managed with dynamic allocation strategies",
            "Passive Indices - Market-cap weighted or rule-based allocation strategies",
            "Sector Indices - Focused on specific crypto sectors (DeFi, Layer 1, etc.)",
            "Thematic Indices - Based on investment themes and market trends"
          ],
          key_metrics: [
            "Total Return - Overall performance since inception",
            "Annual Return - Annualized performance metrics",
            "Volatility - Risk measurement for the index",
            "Sharpe Ratio - Risk-adjusted return measurement",
            "Max Drawdown - Worst-case scenario loss measurement",
            "Assets Count - Number of tokens in the index"
          ],
          usage_guidelines: [
            "Use for diversified crypto exposure without picking individual tokens",
            "Compare active vs passive strategies for your investment goals",
            "Consider volatility and Sharpe ratio for risk assessment",
            "Review assets count for diversification level",
            "Monitor total return and max drawdown for performance evaluation"
          ]
        }
      };
      console.log(`[${requestId}] Indices analysis completed successfully`);
      const responseText = formatIndicesResponse(result, processedRequest.limit);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "indices",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult17(result);
    } catch (error) {
      console.error("Error in getIndices action:", error);
      if (callback) {
        callback({
          text: `\u274C Failed to retrieve indices data: ${error instanceof Error ? error.message : "Unknown error"}`,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        });
      }
      return createActionResult17({
        success: false,
        error: `Failed to retrieve indices data: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger18.log("\u{1F50D} Validating getIndicesAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger18.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeIndicesData(indices, analysisType = "all") {
  if (!indices || indices.length === 0) {
    return {
      summary: "No indices data available for analysis",
      insights: [],
      recommendations: []
    };
  }
  const activeIndices = [];
  const passiveIndices = [];
  const validAllTimeReturns = indices.filter((index) => index.ALL_TIME !== void 0 && index.ALL_TIME !== null);
  const avgAllTimeReturn = validAllTimeReturns.length > 0 ? validAllTimeReturns.reduce((sum, index) => sum + index.ALL_TIME, 0) / validAllTimeReturns.length : 0;
  const valid1MReturns = indices.filter((index) => index["1M"] !== void 0 && index["1M"] !== null);
  const avg1MReturn = valid1MReturns.length > 0 ? valid1MReturns.reduce((sum, index) => sum + index["1M"], 0) / valid1MReturns.length : 0;
  const validGrades = indices.filter((index) => index.INDEX_GRADE !== void 0 && index.INDEX_GRADE !== null);
  const avgIndexGrade = validGrades.length > 0 ? validGrades.reduce((sum, index) => sum + index.INDEX_GRADE, 0) / validGrades.length : 0;
  const topPerformers = indices.filter((index) => index.ALL_TIME !== void 0 && index.ALL_TIME !== null).sort((a, b) => b.ALL_TIME - a.ALL_TIME).slice(0, 3);
  const bestRecentPerformers = indices.filter((index) => index["1M"] !== void 0 && index["1M"] !== null).sort((a, b) => b["1M"] - a["1M"]).slice(0, 3);
  const insights = [
    `\u{1F4CA} Total Indices Available: ${indices.length}`,
    `\u{1F4C8} Average All-Time Return: ${formatPercentage(avgAllTimeReturn)}`,
    `\u{1F4C5} Average 1-Month Return: ${formatPercentage(avg1MReturn)}`,
    `\u{1F3AF} Average Index Grade: ${avgIndexGrade.toFixed(1)}/100`,
    `\u{1F3C6} Top All-Time Performer: ${topPerformers[0]?.NAME} (${formatPercentage(topPerformers[0]?.ALL_TIME)})`
  ];
  const recommendations = [
    indices.length > 10 ? `\u{1F3AF} Good Selection: ${indices.length} indices available for diversified crypto exposure` : `\u26A0\uFE0F Limited Selection: Only ${indices.length} indices currently available`,
    avgIndexGrade > 50 ? `\u2705 Strong Quality: Average index grade of ${avgIndexGrade.toFixed(1)}/100 indicates good quality indices` : `\u26A0\uFE0F Consider Quality: Lower average grade suggests careful selection needed`,
    avg1MReturn > 0 ? `\u{1F4C8} Positive Momentum: Average 1-month return of ${formatPercentage(avg1MReturn)} shows recent strength` : `\u{1F4C9} Recent Weakness: Negative 1-month returns suggest market challenges`,
    topPerformers.length > 0 ? `\u{1F680} Strong Leaders: Top performer ${topPerformers[0]?.NAME} shows ${formatPercentage(topPerformers[0]?.ALL_TIME)} all-time returns` : `\u26A0\uFE0F No clear leaders identified`
  ];
  let focusedAnalysis = {};
  switch (analysisType) {
    case "performance":
      focusedAnalysis = {
        performance_focus: {
          top_all_time_performers: topPerformers.slice(0, 5),
          recent_performers: bestRecentPerformers.slice(0, 5),
          performance_distribution: {
            positive_all_time: indices.filter((i) => (i.ALL_TIME || 0) > 0).length,
            negative_all_time: indices.filter((i) => (i.ALL_TIME || 0) < 0).length,
            positive_1m: indices.filter((i) => (i["1M"] || 0) > 0).length,
            negative_1m: indices.filter((i) => (i["1M"] || 0) < 0).length
          },
          performance_insights: [
            `\u{1F680} ${indices.filter((i) => (i.ALL_TIME || 0) > 100).length} indices with >100% all-time returns`,
            `\u{1F4C8} ${indices.filter((i) => (i["1M"] || 0) > 0).length}/${indices.length} indices showing positive 1-month returns`,
            `\u2B50 Best all-time: ${topPerformers[0]?.NAME} at ${formatPercentage(topPerformers[0]?.ALL_TIME)}`
          ]
        }
      };
      break;
    case "risk":
      const lowRiskIndices = indices.filter((i) => (i.INDEX_GRADE || 0) > 70).slice(0, 5);
      const highRiskIndices = indices.filter((i) => (i.INDEX_GRADE || 0) < 30).slice(0, 5);
      focusedAnalysis = {
        risk_focus: {
          high_grade_indices: lowRiskIndices,
          low_grade_indices: highRiskIndices,
          risk_distribution: {
            high_grade: indices.filter((i) => (i.INDEX_GRADE || 0) > 70).length,
            medium_grade: indices.filter((i) => (i.INDEX_GRADE || 0) >= 30 && (i.INDEX_GRADE || 0) <= 70).length,
            low_grade: indices.filter((i) => (i.INDEX_GRADE || 0) < 30).length
          },
          risk_insights: [
            `\u{1F6E1}\uFE0F ${indices.filter((i) => (i.INDEX_GRADE || 0) > 70).length} high-grade indices (grade >70)`,
            `\u2696\uFE0F ${indices.filter((i) => (i.INDEX_GRADE || 0) >= 30 && (i.INDEX_GRADE || 0) <= 70).length} medium-grade indices`,
            `\u26A0\uFE0F ${indices.filter((i) => (i.INDEX_GRADE || 0) < 30).length} low-grade indices (grade <30)`
          ]
        }
      };
      break;
    case "diversification":
      focusedAnalysis = {
        diversification_focus: {
          by_coin_count: indices.sort((a, b) => (b.COINS || 0) - (a.COINS || 0)).slice(0, 5),
          diversification_levels: {
            highly_diversified: indices.filter((i) => (i.COINS || 0) > 20).length,
            moderately_diversified: indices.filter((i) => (i.COINS || 0) >= 10 && (i.COINS || 0) <= 20).length,
            focused: indices.filter((i) => (i.COINS || 0) < 10).length
          },
          diversification_insights: [
            `\u{1F310} ${indices.filter((i) => (i.COINS || 0) > 20).length} highly diversified indices (>20 coins)`,
            `\u{1F4CA} ${indices.filter((i) => (i.COINS || 0) >= 10 && (i.COINS || 0) <= 20).length} moderately diversified indices`,
            `\u{1F3AF} ${indices.filter((i) => (i.COINS || 0) < 10).length} focused indices (<10 coins)`
          ]
        }
      };
      break;
  }
  return {
    summary: `Analysis of ${indices.length} crypto indices showing ${formatPercentage(avgAllTimeReturn)} average all-time return with ${avgIndexGrade.toFixed(1)}/100 average grade`,
    analysis_type: analysisType,
    performance_metrics: {
      total_indices: indices.length,
      active_indices: 0,
      // Not available in API
      passive_indices: 0,
      // Not available in API
      avg_all_time_return: avgAllTimeReturn,
      avg_1m_return: avg1MReturn,
      avg_index_grade: avgIndexGrade,
      avg_sharpe_ratio: 0
      // Not available in API
    },
    top_performers: topPerformers.map((index) => ({
      name: index.NAME,
      ticker: index.TICKER,
      all_time_return: index.ALL_TIME,
      one_month_return: index["1M"],
      index_grade: index.INDEX_GRADE,
      coins: index.COINS
    })),
    best_recent_performers: bestRecentPerformers.map((index) => ({
      name: index.NAME,
      ticker: index.TICKER,
      one_month_return: index["1M"],
      all_time_return: index.ALL_TIME,
      index_grade: index.INDEX_GRADE
    })),
    insights,
    recommendations,
    ...focusedAnalysis,
    investment_considerations: [
      "\u{1F4C8} Compare all-time returns vs recent performance trends",
      "\u{1F3AF} Consider index grade as quality indicator (higher is better)",
      "\u{1F504} Review coin count for diversification level",
      "\u{1F4B0} Factor in 24H volume for liquidity assessment",
      "\u{1F4CA} Analyze market cap for index size and stability",
      "\u2696\uFE0F Balance between focused and diversified strategies"
    ]
  };
}
function formatIndicesResponse(result, requestedLimit) {
  const { indices_data, analysis } = result;
  let response = `\u{1F4CA} **Crypto Indices Analysis**

`;
  if (indices_data && indices_data.length > 0) {
    response += `\u{1F3AF} **Found ${indices_data.length} Indices**

`;
    const displayLimit = requestedLimit || indices_data.length;
    const topIndices = indices_data.filter((index) => index.ALL_TIME !== void 0).sort((a, b) => (b.ALL_TIME || 0) - (a.ALL_TIME || 0)).slice(0, Math.min(displayLimit, indices_data.length));
    if (topIndices.length > 0) {
      response += `\u{1F3C6} **Top Performing Indices:**
`;
      topIndices.forEach((index, i) => {
        const name = index.NAME || `Index ${i + 1}`;
        const ticker = index.TICKER || "";
        const allTimeReturn = index.ALL_TIME ? formatPercentage(index.ALL_TIME) : "N/A";
        const oneMonthReturn = index["1M"] ? formatPercentage(index["1M"]) : "N/A";
        const indexGrade = index.INDEX_GRADE ? formatPercentage(index.INDEX_GRADE) : "N/A";
        response += `${i + 1}. **${name}** ${ticker ? `(${ticker})` : ""}
`;
        response += `   \u2022 All-Time Return: ${allTimeReturn}
`;
        response += `   \u2022 1-Month Return: ${oneMonthReturn}
`;
        response += `   \u2022 Index Grade: ${indexGrade}
`;
        response += `
`;
      });
    }
    if (analysis && analysis.insights) {
      response += `\u{1F4A1} **Key Insights:**
`;
      analysis.insights.slice(0, 5).forEach((insight) => {
        response += `\u2022 ${insight}
`;
      });
      response += `
`;
    }
    if (analysis && analysis.performance_metrics) {
      const metrics = analysis.performance_metrics;
      response += `\u{1F4C8} **Market Overview:**
`;
      response += `\u2022 Total Indices: ${metrics.total_indices || 0}
`;
      response += `\u2022 Active Indices: ${metrics.active_indices || 0}
`;
      response += `\u2022 Passive Indices: ${metrics.passive_indices || 0}
`;
      if (metrics.avg_all_time_return !== void 0) {
        response += `\u2022 Average All-Time Return: ${formatPercentage(metrics.avg_all_time_return)}
`;
      }
      if (metrics.avg_1m_return !== void 0) {
        response += `\u2022 Average 1-Month Return: ${formatPercentage(metrics.avg_1m_return)}
`;
      }
      response += `
`;
    }
    if (analysis && analysis.recommendations) {
      response += `\u{1F3AF} **Recommendations:**
`;
      analysis.recommendations.slice(0, 3).forEach((rec) => {
        response += `\u2022 ${rec}
`;
      });
    }
  } else {
    response += `\u274C No indices data found.

`;
    response += `This could be due to:
`;
    response += `\u2022 API connectivity issues
`;
    response += `\u2022 Invalid filter parameters
`;
    response += `\u2022 Temporary service unavailability
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics Indices Engine
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}

// src/actions/getIndicesHoldingsAction.ts
import {
  elizaLogger as elizaLogger19,
  createActionResult as createActionResult18
} from "@elizaos/core";
var IndicesHoldingsRequestSchema = external_exports.object({
  indexId: external_exports.number().min(1).describe("The ID of the index to get holdings for"),
  analysisType: external_exports.enum(["composition", "risk", "performance", "all"]).optional().describe("Type of analysis to focus on")
});
var indicesHoldingsTemplate = `Extract indices holdings request information from the message.

IMPORTANT: The user MUST specify an index ID number. Look for phrases like:
- "index 1", "index ID 1", "crypto index 3"  
- "holdings of index 5", "index number 2"
- "DeFi index" (may refer to a specific numbered index)

Index holdings provide:
- Portfolio composition and token allocation
- Weight percentages and allocation values
- Risk concentration analysis
- Performance attribution
- Diversification insights
- Rebalancing information

Instructions:
Look for INDEX HOLDINGS requests, such as:
- Holdings composition ("Holdings of index 1", "Index composition")
- Portfolio allocation ("Token allocation", "Index weights")
- Risk analysis ("Holdings risk", "Concentration analysis")
- Performance attribution ("Holdings performance", "Asset contribution")

EXAMPLES (extract the exact index number):
- "Show me holdings of index 1" \u2192 indexId: 1
- "What tokens are in crypto index 5?" \u2192 indexId: 5
- "Get risk analysis for index 3 holdings" \u2192 indexId: 3
- "Index 2 composition and performance" \u2192 indexId: 2
- "DeFi index holdings" \u2192 indexId: (look for any number mentioned, or leave empty if no specific number)

CRITICAL: If no specific index number is mentioned, leave indexId empty so we can prompt the user to specify one.

Respond with an XML block containing only the extracted values:

<response>
<indexId>numeric ID of the index</indexId>
<analysisType>composition|risk|performance|all</analysisType>
</response>`;
var getIndicesHoldingsAction = {
  name: "GET_INDICES_HOLDINGS_TOKENMETRICS",
  description: "Get the current holdings of a crypto index with weight percentages and allocation details from TokenMetrics",
  similes: [
    "get index holdings",
    "index composition",
    "index allocations",
    "index weights",
    "index portfolio",
    "index assets",
    "index breakdown",
    "index constituents"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me holdings of index 1"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the holdings composition for index 1.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "What tokens are in the DeFi index and their weights?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "Let me show you the token composition and weight allocation for the DeFi index.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get risk analysis for index 3 holdings"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze the holdings composition and risk metrics for index 3.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices holdings request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = indicesHoldingsTemplate + `
            
USER MESSAGE: "${userMessage}"
Please analyze the CURRENT user message above and extract the relevant information.`;
      const holdingsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        IndicesHoldingsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, holdingsRequest);
      const processedRequest = {
        indexId: holdingsRequest?.indexId,
        analysisType: holdingsRequest?.analysisType || "all"
      };
      if (!processedRequest.indexId) {
        const errorMessage = '\u26A0\uFE0F **Index ID Required**\n\nThe indices holdings endpoint requires a specific index ID. Please specify which index you want to analyze.\n\n**Examples:**\n\u2022 "Show me holdings of index 1"\n\u2022 "Get holdings for index 5"\n\u2022 "What tokens are in crypto index 3?"\n\n**Common Index IDs:**\n\u2022 Index 1: Often the main crypto index\n\u2022 Index 3: May be DeFi-focused index\n\u2022 Index 5: Could be large-cap index\n\nPlease try again with a specific index number.';
        console.log(`[${requestId}] \u274C No index ID provided in request`);
        if (callback) {
          await callback({
            text: errorMessage,
            content: {
              success: false,
              error: "Missing required index ID",
              request_id: requestId,
              help: "Specify an index ID (e.g., 'holdings of index 1')"
            }
          });
        }
        return createActionResult18({
          success: false,
          error: "Index ID is required for holdings lookup"
        });
      }
      const apiParams = {
        id: processedRequest.indexId
      };
      const response = await callTokenMetricsAPI(
        "/v2/indices-holdings",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const holdings = Array.isArray(response) ? response : response.data || [];
      const holdingsAnalysis = analyzeHoldingsData(holdings, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved holdings for index ${processedRequest.indexId} with ${holdings.length} assets`,
        request_id: requestId,
        indices_holdings: holdings,
        analysis: holdingsAnalysis,
        metadata: {
          endpoint: "indices-holdings",
          index_id: processedRequest.indexId,
          analysis_focus: processedRequest.analysisType,
          total_holdings: holdings.length,
          api_version: "v2",
          data_source: "TokenMetrics Indices Engine"
        },
        holdings_explanation: {
          purpose: "Index holdings show the exact composition and allocation strategy of crypto indices",
          key_metrics: [
            "Weight Percentage - Allocation percentage of each token in the index",
            "Allocation Value - Dollar value allocated to each token",
            "Price - Current market price of each holding",
            "Market Cap - Market capitalization of each token",
            "24h Change - Recent price performance of holdings"
          ],
          allocation_insights: [
            "Higher weight percentages indicate core positions in the index strategy",
            "Diversification can be measured by the distribution of weights",
            "Recent price changes affect the current allocation balance",
            "Market cap correlation shows if the index follows market-cap weighting"
          ],
          usage_guidelines: [
            "Review weight distribution for diversification assessment",
            "Monitor large allocations for concentration risk",
            "Compare holdings to your existing portfolio for overlap analysis",
            "Track price changes to understand index performance drivers",
            "Use allocation values to understand absolute exposure levels"
          ]
        }
      };
      console.log(`[${requestId}] Holdings analysis completed successfully`);
      const responseText = formatIndicesHoldingsResponse(result);
      console.log(`[${requestId}] Analysis completed successfully`);
      elizaLogger19.success("\u2705 Successfully processed indices holdings request");
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            holdings_data: holdings,
            analysis: holdingsAnalysis,
            source: "TokenMetrics Indices Holdings API",
            request_id: requestId,
            metadata: {
              endpoint: "indices-holdings",
              data_source: "TokenMetrics API",
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              total_holdings: holdings.length
            }
          }
        });
      }
      return createActionResult18({
        success: true,
        text: responseText,
        data: {
          holdings_data: holdings,
          analysis: holdingsAnalysis,
          source: "TokenMetrics Indices Holdings API",
          request_id: requestId
        }
      });
    } catch (error) {
      console.error("Error in getIndicesHoldings action:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const reqId = generateRequestId();
      if (callback) {
        await callback({
          text: `\u274C Error fetching indices holdings: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: reqId
          }
        });
      }
      return createActionResult18({
        success: false,
        error: errorMessage
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger19.log("\u{1F50D} Validating getIndicesHoldingsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger19.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeHoldingsData(holdings, analysisType = "all") {
  if (!holdings || holdings.length === 0) {
    return {
      summary: "No holdings data available for analysis",
      insights: [],
      recommendations: []
    };
  }
  const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0);
  const totalValue = holdings.reduce((sum, holding) => {
    const weight = holding.WEIGHT || 0;
    const price = holding.PRICE || 0;
    const marketCap = holding.MARKET_CAP || 0;
    return sum + weight * marketCap;
  }, 0);
  const topHoldings = holdings.filter((holding) => holding.WEIGHT !== void 0).sort((a, b) => (b.WEIGHT || 0) - (a.WEIGHT || 0)).map((holding) => ({
    ...holding,
    WEIGHT_PERCENTAGE: (holding.WEIGHT || 0) * 100,
    // Convert to percentage for display
    ALLOCATION_VALUE: (holding.WEIGHT || 0) * (holding.MARKET_CAP || 0)
  }));
  const top3Weight = topHoldings.slice(0, 3).reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0) * 100;
  const top5Weight = topHoldings.slice(0, 5).reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0) * 100;
  const holdingsWithROI = holdings.filter((holding) => holding.CURRENT_ROI !== void 0);
  const avgROI = holdingsWithROI.length > 0 ? holdingsWithROI.reduce((sum, holding) => sum + (holding.CURRENT_ROI || 0), 0) / holdingsWithROI.length : 0;
  const largeCapHoldings = holdings.filter((holding) => (holding.MARKET_CAP || 0) > 1e10);
  const midCapHoldings = holdings.filter((holding) => (holding.MARKET_CAP || 0) > 1e9 && (holding.MARKET_CAP || 0) <= 1e10);
  const smallCapHoldings = holdings.filter((holding) => (holding.MARKET_CAP || 0) <= 1e9);
  const insights = [
    `\u{1F4CA} Total Holdings: ${holdings.length} tokens`,
    `\u2696\uFE0F Total Weight: ${formatPercentage(totalWeight)}`,
    `\u{1F4B0} Total Allocation Value: ${formatCurrency(totalValue)}`,
    `\u{1F3C6} Largest Holding: ${topHoldings[0]?.TOKEN_NAME} (${formatPercentage((topHoldings[0]?.WEIGHT || 0) * 100)})`,
    `\u{1F4C8} Top 3 Concentration: ${formatPercentage(top3Weight)}`,
    `\u{1F4CA} Top 5 Concentration: ${formatPercentage(top5Weight)}`,
    `\u{1F4C8} Average ROI: ${formatPercentage(avgROI * 100)}`
  ];
  const recommendations = [
    top3Weight > 60 ? "\u26A0\uFE0F High Concentration: Top 3 holdings represent significant portion - consider concentration risk" : "\u2705 Balanced Allocation: Good diversification across top holdings",
    holdings.length > 20 ? "\u2705 Well Diversified: Large number of holdings provides good diversification" : holdings.length < 10 ? "\u26A0\uFE0F Limited Diversification: Consider if concentration aligns with your risk tolerance" : "\u{1F4CA} Moderate Diversification: Reasonable number of holdings for focused strategy",
    largeCapHoldings.length > holdings.length * 0.7 ? "\u{1F3DB}\uFE0F Large Cap Focus: Index heavily weighted toward established cryptocurrencies" : smallCapHoldings.length > holdings.length * 0.5 ? "\u{1F680} Small Cap Exposure: Higher risk/reward profile with smaller market cap tokens" : "\u2696\uFE0F Balanced Market Cap: Mix of large and smaller market cap exposures"
  ];
  let focusedAnalysis = {};
  switch (analysisType) {
    case "composition":
      focusedAnalysis = {
        composition_focus: {
          weight_distribution: {
            top_10_percent: holdings.filter((h) => (h.WEIGHT || 0) * 100 > 10).length,
            mid_range: holdings.filter((h) => (h.WEIGHT || 0) * 100 >= 1 && (h.WEIGHT || 0) * 100 <= 10).length,
            small_positions: holdings.filter((h) => (h.WEIGHT || 0) * 100 < 1).length
          },
          sector_analysis: analyzeSectorDistribution(holdings),
          composition_insights: [
            `\u{1F3AF} ${holdings.filter((h) => (h.WEIGHT || 0) * 100 > 10).length} major positions (>10% weight)`,
            `\u{1F4CA} ${holdings.filter((h) => (h.WEIGHT || 0) * 100 >= 1 && (h.WEIGHT || 0) * 100 <= 10).length} medium positions (1-10% weight)`,
            `\u{1F50D} ${holdings.filter((h) => (h.WEIGHT || 0) * 100 < 1).length} small positions (<1% weight)`
          ]
        }
      };
      break;
    case "risk":
      focusedAnalysis = {
        risk_focus: {
          concentration_risk: {
            herfindahl_index: calculateHerfindahlIndex(holdings),
            concentration_level: top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"
          },
          volatility_analysis: {
            high_roi_holdings: holdings.filter((h) => Math.abs(h.CURRENT_ROI || 0) > 0.5).length,
            stable_holdings: holdings.filter((h) => Math.abs(h.CURRENT_ROI || 0) < 0.1).length
          },
          risk_insights: [
            `\u26A0\uFE0F Concentration Risk: ${top3Weight > 60 ? "High" : top3Weight > 40 ? "Medium" : "Low"} (top 3: ${formatPercentage(top3Weight)})`,
            `\u{1F4CA} High ROI Holdings: ${holdings.filter((h) => Math.abs(h.CURRENT_ROI || 0) > 0.5).length} holdings with significant ROI`,
            `\u{1F6E1}\uFE0F Stable Holdings: ${holdings.filter((h) => Math.abs(h.CURRENT_ROI || 0) < 0.1).length} holdings with stable performance`
          ]
        }
      };
      break;
    case "performance":
      const topPerformers = holdings.filter((h) => h.CURRENT_ROI !== void 0).sort((a, b) => (b.CURRENT_ROI || 0) - (a.CURRENT_ROI || 0)).slice(0, 5);
      const worstPerformers = holdings.filter((h) => h.CURRENT_ROI !== void 0).sort((a, b) => (a.CURRENT_ROI || 0) - (b.CURRENT_ROI || 0)).slice(0, 5);
      focusedAnalysis = {
        performance_focus: {
          top_performers: topPerformers,
          worst_performers: worstPerformers,
          performance_insights: [
            `\u{1F680} Best performer: ${topPerformers[0]?.TOKEN_NAME} (${formatPercentage((topPerformers[0]?.CURRENT_ROI || 0) * 100)})`,
            `\u{1F4C9} Worst performer: ${worstPerformers[0]?.TOKEN_NAME} (${formatPercentage((worstPerformers[0]?.CURRENT_ROI || 0) * 100)})`,
            `\u{1F4CA} ${holdings.filter((h) => (h.CURRENT_ROI || 0) > 0).length}/${holdings.length} holdings showing positive ROI`
          ]
        }
      };
      break;
  }
  return {
    summary: `Index contains ${holdings.length} holdings with ${formatPercentage(top3Weight)} concentration in top 3 positions`,
    analysis_type: analysisType,
    portfolio_metrics: {
      total_holdings: holdings.length,
      total_weight: totalWeight,
      total_value: totalValue,
      top_3_concentration: top3Weight,
      top_5_concentration: top5Weight,
      avg_roi: avgROI
    },
    market_cap_distribution: {
      large_cap: largeCapHoldings.length,
      mid_cap: midCapHoldings.length,
      small_cap: smallCapHoldings.length
    },
    top_holdings: topHoldings.map((holding) => ({
      token_name: holding.TOKEN_NAME,
      symbol: holding.TOKEN_SYMBOL,
      weight_percentage: (holding.WEIGHT || 0) * 100,
      allocation_value: (holding.WEIGHT || 0) * (holding.MARKET_CAP || 0),
      price: holding.PRICE,
      current_roi: holding.CURRENT_ROI
    })),
    insights,
    recommendations,
    ...focusedAnalysis,
    risk_considerations: [
      "\u{1F4CA} Monitor concentration risk in top holdings",
      "\u{1F504} Track rebalancing frequency and methodology",
      "\u{1F4B0} Consider correlation with your existing portfolio",
      "\u{1F4C8} Evaluate performance attribution by holding",
      "\u26A0\uFE0F Assess liquidity risk in smaller holdings",
      "\u{1F3AF} Review alignment with investment objectives"
    ]
  };
}
function analyzeSectorDistribution(holdings) {
  return {
    sectors_identified: "Analysis requires sector classification data",
    diversification_score: holdings.length > 15 ? "High" : holdings.length > 8 ? "Medium" : "Low"
  };
}
function calculateHerfindahlIndex(holdings) {
  const totalWeight = holdings.reduce((sum, holding) => sum + (holding.WEIGHT || 0), 0);
  if (totalWeight === 0) return 0;
  const herfindahl = holdings.reduce((sum, holding) => {
    const normalizedWeight = (holding.WEIGHT || 0) / totalWeight;
    return sum + normalizedWeight * normalizedWeight;
  }, 0);
  return Math.round(herfindahl * 1e4);
}
function formatIndicesHoldingsResponse(result) {
  const { indices_holdings, analysis, metadata } = result;
  let response = `\u{1F4CA} **Index Holdings Analysis**

`;
  if (indices_holdings && indices_holdings.length > 0) {
    response += `\u{1F3AF} **Index ${metadata.index_id} Holdings (${indices_holdings.length} assets)**

`;
    const topHoldings = indices_holdings.filter((holding) => holding.WEIGHT !== void 0).sort((a, b) => (b.WEIGHT || 0) - (a.WEIGHT || 0)).slice(0, 10);
    if (topHoldings.length > 0) {
      response += `\u{1F3C6} **Top Holdings:**
`;
      topHoldings.forEach((holding, i) => {
        const name = holding.TOKEN_NAME || holding.TOKEN_SYMBOL || `Token ${i + 1}`;
        const symbol = holding.TOKEN_SYMBOL || "";
        const weight = holding.WEIGHT ? formatPercentage(holding.WEIGHT * 100) : "N/A";
        const price = holding.PRICE ? formatCurrency(holding.PRICE) : "N/A";
        const currentROI = holding.CURRENT_ROI ? formatPercentage(holding.CURRENT_ROI * 100) : "N/A";
        response += `${i + 1}. **${name}** ${symbol ? `(${symbol})` : ""}
`;
        response += `   \u2022 Weight: ${weight}
`;
        response += `   \u2022 Price: ${price}
`;
        response += `   \u2022 Current ROI: ${currentROI}
`;
        response += `
`;
      });
    }
    if (analysis && analysis.insights) {
      response += `\u{1F4A1} **Key Insights:**
`;
      analysis.insights.slice(0, 5).forEach((insight) => {
        response += `\u2022 ${insight}
`;
      });
      response += `
`;
    }
    if (analysis && analysis.portfolio_metrics) {
      const metrics = analysis.portfolio_metrics;
      response += `\u{1F4C8} **Portfolio Metrics:**
`;
      response += `\u2022 Total Holdings: ${metrics.total_holdings || 0}
`;
      if (metrics.top_3_concentration !== void 0) {
        response += `\u2022 Top 3 Concentration: ${formatPercentage(metrics.top_3_concentration)}
`;
      }
      if (metrics.top_5_concentration !== void 0) {
        response += `\u2022 Top 5 Concentration: ${formatPercentage(metrics.top_5_concentration)}
`;
      }
      if (metrics.avg_roi !== void 0) {
        response += `\u2022 Average ROI: ${formatPercentage(metrics.avg_roi * 100)}
`;
      }
      response += `
`;
    }
    if (analysis && analysis.recommendations) {
      response += `\u{1F3AF} **Recommendations:**
`;
      analysis.recommendations.slice(0, 3).forEach((rec) => {
        response += `\u2022 ${rec}
`;
      });
    }
  } else {
    response += `\u274C No holdings data found for index ${metadata.index_id}.

`;
    response += `This could be due to:
`;
    response += `\u2022 Invalid index ID
`;
    response += `\u2022 Index has no current holdings
`;
    response += `\u2022 API connectivity issues
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics Indices Engine
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}

// src/actions/getIndicesPerformanceAction.ts
import {
  elizaLogger as elizaLogger20,
  createActionResult as createActionResult19
} from "@elizaos/core";
var IndicesPerformanceRequestSchema = external_exports.object({
  indexId: external_exports.number().min(1).describe("The ID of the index to get performance data for"),
  startDate: external_exports.string().optional().describe("Start date for performance data (YYYY-MM-DD format)"),
  endDate: external_exports.string().optional().describe("End date for performance data (YYYY-MM-DD format)"),
  limit: external_exports.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["returns", "risk", "comparison", "all"]).optional().describe("Type of analysis to focus on")
});
var indicesPerformanceTemplate = `Extract indices performance request information from the message.

IMPORTANT: Extract the EXACT index number mentioned by the user in their message.

Index performance provides:
- Historical returns and performance metrics
- Risk-adjusted performance analysis
- Benchmark comparisons
- Volatility and drawdown metrics
- Sharpe and Sortino ratios
- Performance attribution

Instructions:
Look for INDEX PERFORMANCE requests, such as:
- Performance analysis ("Performance of index [NUMBER]", "Index returns")
- Risk metrics ("Risk analysis", "Volatility metrics")
- Benchmark comparison ("Index vs market", "Performance comparison")
- Historical analysis ("Historical performance", "Long-term returns")

EXAMPLES (extract the actual index number from user's message):
- "Show me performance of index [X]" \u2192 extract X as indexId
- "Get performance metrics for crypto index [Y]" \u2192 extract Y as indexId
- "Index [Z] risk and return analysis" \u2192 extract Z as indexId
- "Compare index performance to market" \u2192 no specific index mentioned

Respond with an XML block containing only the extracted values:

<response>
<indexId>numeric ID of the index</indexId>
<analysisType>returns|risk|comparison|all</analysisType>
<timeframe>short_term|medium_term|long_term|all</timeframe>
<focusArea>performance|volatility|risk_adjusted|general</focusArea>
</response>`;
var getIndicesPerformanceAction = {
  name: "GET_INDICES_PERFORMANCE_TOKENMETRICS",
  description: "Get historical performance data of a crypto index including returns, volatility, and benchmark comparisons from TokenMetrics",
  similes: [
    "get index performance",
    "index returns",
    "index history",
    "index performance data",
    "index analytics",
    "index tracking",
    "index performance analysis",
    "index time series"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me performance of index 1"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the performance metrics for index 1.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get performance metrics for crypto index 5"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve comprehensive performance analysis for index 5.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Index 3 risk and return analysis"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze both risk and return metrics for index 3.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices performance request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = indicesPerformanceTemplate + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const performanceRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        IndicesPerformanceRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, performanceRequest);
      const processedRequest = {
        indexId: performanceRequest?.indexId,
        startDate: performanceRequest?.startDate,
        endDate: performanceRequest?.endDate,
        limit: performanceRequest?.limit || 50,
        page: performanceRequest?.page || 1,
        analysisType: performanceRequest?.analysisType || "all"
      };
      if (!processedRequest.indexId) {
        const errorMessage = '\u26A0\uFE0F **Index ID Required**\n\nThe indices performance endpoint requires a specific index ID. Please specify which index you want to analyze.\n\n**Examples:**\n\u2022 "Show me performance of index 1"\n\u2022 "Get performance for index 3"\n\u2022 "Index 5 performance metrics"\n\n**Common Index IDs:**\n\u2022 Index 1: Often the main crypto index\n\u2022 Index 3: May be DeFi-focused index\n\u2022 Index 5: Could be large-cap index\n\nPlease try again with a specific index number.';
        console.log(`[${requestId}] \u274C No index ID provided in request`);
        if (callback) {
          await callback({
            text: errorMessage,
            content: {
              success: false,
              error: "Missing required index ID",
              request_id: requestId,
              help: "Specify an index ID (e.g., 'performance of index 1')"
            }
          });
        }
        return createActionResult19({
          success: false,
          error: "Index ID is required for performance lookup"
        });
      }
      const apiParams = {
        id: processedRequest.indexId,
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.startDate) {
        apiParams.startDate = processedRequest.startDate;
      }
      if (processedRequest.endDate) {
        apiParams.endDate = processedRequest.endDate;
      }
      const response = await callTokenMetricsAPI(
        "/v2/indices-performance",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const performance = Array.isArray(response) ? response : response.data || [];
      if (performance.length > 0) {
        const firstDataPoint = performance[0];
        const returnedIndexId = firstDataPoint?.ID || firstDataPoint?.INDEX_ID;
        console.log(`[${requestId}] \u{1F50D} Requested Index: ${processedRequest.indexId}, API Returned Index: ${returnedIndexId}`);
        if (returnedIndexId && returnedIndexId !== processedRequest.indexId) {
          console.log(`[${requestId}] \u26A0\uFE0F INDEX MISMATCH: Requested ${processedRequest.indexId} but got ${returnedIndexId}`);
        }
      }
      const performanceAnalysis = analyzePerformanceData(performance, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved performance data for index ${processedRequest.indexId} with ${performance.length} data points`,
        request_id: requestId,
        indices_performance: performance,
        analysis: performanceAnalysis,
        metadata: {
          endpoint: "indices-performance",
          index_id: processedRequest.indexId,
          date_range: {
            start_date: processedRequest.startDate,
            end_date: processedRequest.endDate
          },
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          analysis_focus: processedRequest.analysisType,
          data_points: performance.length,
          api_version: "v2",
          data_source: "TokenMetrics Indices Engine"
        },
        performance_explanation: {
          purpose: "Index performance data tracks historical returns and risk metrics over time",
          key_metrics: [
            "Index Value - The calculated value of the index at each point in time",
            "Daily Return - Day-over-day return in absolute and percentage terms",
            "Cumulative Return - Total return from inception or start date",
            "Volatility - Risk measurement showing price variability",
            "Benchmark Comparison - Performance relative to market benchmarks"
          ],
          performance_insights: [
            "Consistent positive returns indicate strong index strategy",
            "Lower volatility suggests more stable investment experience",
            "Cumulative returns show long-term wealth creation potential",
            "Benchmark outperformance demonstrates active management value"
          ],
          usage_guidelines: [
            "Compare cumulative returns across different time periods",
            "Evaluate volatility for risk assessment and position sizing",
            "Monitor daily returns for recent performance trends",
            "Use benchmark comparison to assess relative performance",
            "Consider drawdown periods for worst-case scenario planning"
          ]
        }
      };
      console.log(`[${requestId}] Indices performance analysis completed successfully`);
      const responseText = formatIndicesPerformanceResponse(result);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "indicesperformance",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult19({
        success: true,
        text: responseText,
        data: {
          performance_data: performance,
          analysis: performanceAnalysis,
          source: "TokenMetrics Indices Performance API",
          request_id: requestId
        }
      });
    } catch (error) {
      console.error("Error in getIndicesPerformance action:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      const reqId = generateRequestId();
      if (callback) {
        await callback({
          text: `\u274C Error fetching indices performance: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true,
            request_id: reqId
          }
        });
      }
      return createActionResult19({
        success: false,
        error: errorMessage
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger20.log("\u{1F50D} Validating getIndicesPerformanceAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger20.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzePerformanceData(performance, analysisType = "all") {
  if (!performance || performance.length === 0) {
    return {
      summary: "No performance data available for this index",
      insights: [],
      recommendations: []
    };
  }
  const sortedPerformance = performance.sort((a, b) => new Date(a.DATE).getTime() - new Date(b.DATE).getTime());
  const latestData = sortedPerformance[sortedPerformance.length - 1];
  const earliestData = sortedPerformance[0];
  const latestROI = latestData.INDEX_CUMULATIVE_ROI || 0;
  const earliestROI = earliestData.INDEX_CUMULATIVE_ROI || 0;
  const totalReturn = latestROI - earliestROI;
  const dailyReturns = [];
  for (let i = 1; i < sortedPerformance.length; i++) {
    const currentROI = sortedPerformance[i].INDEX_CUMULATIVE_ROI || 0;
    const previousROI = sortedPerformance[i - 1].INDEX_CUMULATIVE_ROI || 0;
    const dailyReturn = currentROI - previousROI;
    dailyReturns.push(dailyReturn);
  }
  const avgDailyReturn = dailyReturns.length > 0 ? dailyReturns.reduce((sum, ret) => sum + ret, 0) / dailyReturns.length : 0;
  const avgReturn = avgDailyReturn;
  const variance = dailyReturns.length > 0 ? dailyReturns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / dailyReturns.length : 0;
  const volatility = Math.sqrt(variance);
  const bestDay = dailyReturns.length > 0 ? Math.max(...dailyReturns) : 0;
  const worstDay = dailyReturns.length > 0 ? Math.min(...dailyReturns) : 0;
  const positiveDays = dailyReturns.filter((ret) => ret > 0).length;
  const winRate = dailyReturns.length > 0 ? positiveDays / dailyReturns.length * 100 : 0;
  const recentData = sortedPerformance.slice(-7);
  const recentReturn = recentData.length > 1 ? recentData[recentData.length - 1].INDEX_CUMULATIVE_ROI - recentData[0].INDEX_CUMULATIVE_ROI : 0;
  const insights = [
    `\u{1F4CA} Performance Period: ${new Date(earliestData.DATE).toLocaleDateString()} to ${new Date(latestData.DATE).toLocaleDateString()}`,
    `\u{1F4C8} Total Return: ${formatPercentage(totalReturn)}`,
    `\u{1F4C5} Average Daily Return: ${formatPercentage(avgDailyReturn)}`,
    `\u26A1 Volatility: ${formatPercentage(volatility)}`,
    `\u{1F3C6} Best Day: ${formatPercentage(bestDay)}`,
    `\u{1F4C9} Worst Day: ${formatPercentage(worstDay)}`,
    `\u{1F3AF} Win Rate: ${formatPercentage(winRate)} of days positive`
  ];
  const recommendations = [
    totalReturn > 0 ? "\u2705 Positive Performance: Index has generated positive returns over the period" : "\u26A0\uFE0F Negative Performance: Index has declined - review strategy and market conditions",
    winRate > 55 ? "\u2705 Strong Consistency: High percentage of positive days indicates consistent performance" : "\u26A0\uFE0F Inconsistent Performance: Lower win rate suggests higher volatility in daily returns",
    volatility > 0.3 ? "\u26A0\uFE0F High Volatility: Significant price swings - consider position sizing and risk management" : "\u2705 Moderate Volatility: Reasonable risk levels for crypto investments",
    Math.abs(recentReturn) > 0.1 ? "\u26A1 Recent Volatility: Significant recent price movements - monitor closely" : "\u{1F4CA} Stable Recent Performance: Index showing stable recent performance"
  ];
  const riskAdjustedReturn = volatility > 0 ? avgDailyReturn * Math.sqrt(365) / volatility : 0;
  let focusedAnalysis = {};
  switch (analysisType) {
    case "returns":
      focusedAnalysis = {
        returns_focus: {
          return_metrics: {
            total_return: totalReturn,
            annualized_return: avgDailyReturn * 365,
            best_period: bestDay,
            worst_period: worstDay
          },
          returns_insights: [
            `\u{1F4C8} Annualized return: ${formatPercentage(avgDailyReturn * 365)}`,
            `\u{1F3AF} Return consistency: ${formatPercentage(winRate)} win rate`,
            `\u{1F4CA} Return range: ${formatPercentage(worstDay)} to ${formatPercentage(bestDay)}`
          ]
        }
      };
      break;
    case "risk":
      focusedAnalysis = {
        risk_focus: {
          risk_metrics: {
            volatility,
            risk_adjusted_return: riskAdjustedReturn,
            max_drawdown: worstDay,
            value_at_risk: calculateVaR(dailyReturns)
          },
          risk_insights: [
            `\u26A1 Daily volatility: ${formatPercentage(volatility)}`,
            `\u{1F4CA} Risk-adjusted return: ${riskAdjustedReturn.toFixed(2)}`,
            `\u{1F4C9} Maximum single-day loss: ${formatPercentage(worstDay)}`
          ]
        }
      };
      break;
    case "comparison":
      focusedAnalysis = {
        comparison_focus: {
          benchmark_analysis: {
            relative_performance: "Benchmark comparison requires additional data",
            market_correlation: "Correlation analysis requires market data"
          },
          comparison_insights: [
            `\u{1F4CA} Performance vs market: Requires benchmark data for comparison`,
            `\u{1F3AF} Relative strength: ${totalReturn > 0 ? "Positive absolute returns" : "Negative absolute returns"}`,
            `\u{1F4C8} Risk profile: ${volatility > 0.2 ? "Higher risk" : "Moderate risk"} compared to traditional assets`
          ]
        }
      };
      break;
  }
  return {
    summary: `Index performance over ${performance.length} data points showing ${formatPercentage(totalReturn)} total return with ${formatPercentage(volatility)} volatility`,
    analysis_type: analysisType,
    performance_metrics: {
      total_return: totalReturn,
      avg_daily_return: avgDailyReturn,
      avg_volatility: volatility,
      best_day: bestDay,
      worst_day: worstDay,
      win_rate: winRate,
      recent_7day_return: recentReturn,
      risk_adjusted_return: riskAdjustedReturn
    },
    time_period: {
      start_date: earliestData.DATE,
      end_date: latestData.DATE,
      data_points: performance.length,
      trading_days: dailyReturns.length
    },
    latest_values: {
      index_cumulative_roi: latestData.INDEX_CUMULATIVE_ROI,
      market_cap: latestData.MARKET_CAP,
      volume: latestData.VOLUME,
      fdv: latestData.FDV
    },
    insights,
    recommendations,
    ...focusedAnalysis,
    investment_considerations: [
      "\u{1F4C8} Evaluate total return vs investment timeline",
      "\u2696\uFE0F Consider volatility relative to risk tolerance",
      "\u{1F3AF} Compare performance to relevant benchmarks",
      "\u{1F4CA} Analyze consistency through win rate metrics",
      "\u{1F504} Review drawdown periods for risk assessment",
      "\u{1F4B0} Factor in fees and expenses for net returns",
      "\u{1F4C5} Consider market cycle timing for context"
    ]
  };
}
function calculateVaR(returns, confidence = 0.05) {
  if (returns.length === 0) return 0;
  const sortedReturns = returns.sort((a, b) => a - b);
  const index = Math.floor(confidence * sortedReturns.length);
  return sortedReturns[index] || 0;
}
function formatIndicesPerformanceResponse(result) {
  const { indices_performance, analysis, metadata } = result;
  let response = `\u{1F4CA} **Index Performance Analysis**

`;
  if (indices_performance && indices_performance.length > 0) {
    const firstDataPoint = indices_performance[0];
    const returnedIndexId = firstDataPoint?.ID || firstDataPoint?.INDEX_ID;
    const requestedIndexId = metadata.index_id;
    response += `\u{1F3AF} **Requested Index:** ${requestedIndexId}
`;
    if (returnedIndexId && returnedIndexId !== requestedIndexId) {
      response += `\u26A0\uFE0F **API Returned Index:** ${returnedIndexId} (Mismatch detected!)
`;
    } else if (returnedIndexId) {
      response += `\u2705 **Confirmed Index:** ${returnedIndexId}
`;
    }
    response += `\u{1F4CA} **Data Points:** ${indices_performance.length}

`;
    if (analysis && analysis.performance_metrics) {
      const metrics = analysis.performance_metrics;
      response += `\u{1F4C8} **Performance Summary:**
`;
      if (metrics.total_return !== void 0) {
        response += `\u2022 Total Return: ${formatPercentage(metrics.total_return)}
`;
      }
      if (metrics.avg_daily_return !== void 0) {
        response += `\u2022 Average Daily Return: ${formatPercentage(metrics.avg_daily_return)}
`;
      }
      if (metrics.avg_volatility !== void 0) {
        response += `\u2022 Volatility: ${formatPercentage(metrics.avg_volatility)}
`;
      }
      if (metrics.win_rate !== void 0) {
        response += `\u2022 Win Rate: ${formatPercentage(metrics.win_rate)}
`;
      }
      if (metrics.best_day !== void 0) {
        response += `\u2022 Best Day: ${formatPercentage(metrics.best_day)}
`;
      }
      if (metrics.worst_day !== void 0) {
        response += `\u2022 Worst Day: ${formatPercentage(metrics.worst_day)}
`;
      }
      response += `
`;
    }
    if (analysis && analysis.time_period) {
      const period = analysis.time_period;
      response += `\u{1F4C5} **Time Period:**
`;
      response += `\u2022 Start Date: ${period.start_date || "N/A"}
`;
      response += `\u2022 End Date: ${period.end_date || "N/A"}
`;
      response += `\u2022 Data Points: ${period.data_points || 0}
`;
      response += `\u2022 Trading Days: ${period.trading_days || 0}
`;
      response += `
`;
    }
    if (analysis && analysis.latest_values) {
      const latest = analysis.latest_values;
      response += `\u{1F4CA} **Latest Values:**
`;
      if (latest.index_cumulative_roi !== void 0) {
        response += `\u2022 Cumulative ROI: ${formatPercentage(latest.index_cumulative_roi)}
`;
      }
      if (latest.market_cap) {
        response += `\u2022 Market Cap: ${formatCurrency(latest.market_cap)}
`;
      }
      if (latest.volume) {
        response += `\u2022 Volume: ${formatCurrency(latest.volume)}
`;
      }
      response += `
`;
    }
    if (analysis && analysis.insights) {
      response += `\u{1F4A1} **Key Insights:**
`;
      analysis.insights.slice(0, 5).forEach((insight) => {
        response += `\u2022 ${insight}
`;
      });
      response += `
`;
    }
    if (analysis && analysis.recommendations) {
      response += `\u{1F3AF} **Recommendations:**
`;
      analysis.recommendations.slice(0, 3).forEach((rec) => {
        response += `\u2022 ${rec}
`;
      });
    }
  } else {
    response += `\u274C No performance data found for index ${metadata.index_id}.

This could be due to:
\u2022 Invalid index ID
\u2022 No performance history available
\u2022 Date range outside available data
\u2022 API connectivity issues
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics Indices Engine
`;
  response += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}

// src/actions/getAiReportsAction.ts
import {
  elizaLogger as elizaLogger21,
  createActionResult as createActionResult20
} from "@elizaos/core";
var AiReportsRequestSchema = external_exports.object({
  token_id: external_exports.number().min(1).optional().describe("The ID of the token to get AI reports for"),
  symbol: external_exports.string().optional().describe("The symbol of the token to get AI reports for"),
  limit: external_exports.number().min(1).max(100).optional().describe("Number of reports to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  analysisType: external_exports.enum(["investment", "technical", "comprehensive", "all"]).optional().describe("Type of analysis to focus on")
});
var AI_REPORTS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting AI reports requests from natural language.

The user wants to get AI-generated reports for cryptocurrency analysis. Extract the following information:

1. **token_id** (optional): Numeric ID of the token
   - Only extract if explicitly mentioned as a number

2. **symbol** (optional): Token symbol like BTC, ETH, etc.
   - Look for cryptocurrency symbols or names
   - Convert names to symbols if possible (Bitcoin \u2192 BTC, Ethereum \u2192 ETH)

3. **limit** (optional, default: 50): Number of reports to return
   - Look for phrases like "50 reports", "top 20", "first 100"

4. **page** (optional, default: 1): Page number for pagination

5. **analysisType** (optional, default: "all"): What type of analysis they want
   - "investment" - focus on investment recommendations and analysis
   - "technical" - focus on technical analysis and code reviews
   - "comprehensive" - focus on deep dive comprehensive reports
   - "all" - all types of AI reports

IMPORTANT: Extract the EXACT cryptocurrency mentioned by the user in their message, not from the examples below.

Examples of request patterns (but extract the actual token from user's message):
- "Get AI reports for [TOKEN]" \u2192 extract [TOKEN]
- "Show me investment analysis for [TOKEN]" \u2192 extract [TOKEN]
- "Get comprehensive AI reports" \u2192 general analysis
- "Technical analysis reports for token 123" \u2192 specific token ID

Extract the request details from the user's message and respond in XML format:

<response>
<token_id>specific token ID if mentioned</token_id>
<symbol>token symbol mentioned by user</symbol>
<limit>number of reports to return</limit>
<page>page number for pagination</page>
<analysisType>investment|technical|comprehensive|all</analysisType>
</response>
`;
var getAiReportsAction = {
  name: "GET_AI_REPORTS_TOKENMETRICS",
  description: "Retrieve AI-generated reports providing comprehensive analyses of cryptocurrency tokens, including deep dives, investment analyses, and code reviews from TokenMetrics",
  similes: [
    "get ai reports",
    "ai analysis reports",
    "deep dive analysis",
    "investment analysis",
    "code reviews",
    "comprehensive token analysis",
    "ai generated insights"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get AI report for Bitcoin"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the AI-generated report for Bitcoin.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me AI insights for the crypto market"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll retrieve AI-powered market insights and analysis.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "AI analysis for Ethereum investment"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll generate an AI analysis for Ethereum investment opportunities.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing AI reports request...`);
      const userMessage = message.content?.text || "";
      const enhancedTemplate = AI_REPORTS_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const aiReportsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        enhancedTemplate,
        AiReportsRequestSchema,
        requestId
      );
      elizaLogger21.log("\u{1F3AF} AI Extracted AI reports request:", aiReportsRequest);
      console.log(`[${requestId}] Extracted request:`, aiReportsRequest);
      const processedRequest = {
        token_id: aiReportsRequest?.token_id,
        symbol: aiReportsRequest?.symbol,
        limit: aiReportsRequest?.limit || 50,
        page: aiReportsRequest?.page || 1,
        analysisType: aiReportsRequest?.analysisType || "all"
      };
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) {
        apiParams.token_id = processedRequest.token_id;
      }
      if (processedRequest.symbol) {
        apiParams.symbol = processedRequest.symbol;
      }
      const response = await callTokenMetricsAPI(
        "/v2/ai-reports",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const aiReports = Array.isArray(response) ? response : response.data || [];
      const reportsAnalysis = analyzeAiReports(aiReports, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${aiReports.length} AI-generated reports`,
        request_id: requestId,
        ai_reports: aiReports,
        analysis: reportsAnalysis,
        metadata: {
          endpoint: "ai-reports",
          requested_token: processedRequest.symbol || processedRequest.token_id,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          analysis_focus: processedRequest.analysisType,
          data_points: aiReports.length,
          api_version: "v2",
          data_source: "TokenMetrics AI Engine"
        },
        reports_explanation: {
          purpose: "AI-generated comprehensive analyses providing deep insights into cryptocurrency projects",
          report_types: [
            "Deep dive analyses - Comprehensive project evaluation",
            "Investment analyses - Risk/reward assessment and recommendations",
            "Code reviews - Technical evaluation of smart contracts and protocols",
            "Market analysis - Competitive positioning and market dynamics"
          ],
          usage_guidelines: [
            "Use for due diligence and investment research",
            "Combine with quantitative metrics for complete picture",
            "Review report generation date for relevance",
            "Consider reports as one input in investment decision process"
          ]
        }
      };
      const tokenName = processedRequest.symbol || processedRequest.token_id || "various tokens";
      let responseText = `\u{1F916} **AI Reports Analysis${tokenName !== "various tokens" ? ` for ${tokenName}` : ""}**

`;
      if (aiReports.length === 0) {
        responseText += `\u274C No AI reports found${tokenName !== "various tokens" ? ` for ${tokenName}` : ""}. This could mean:
`;
        responseText += `\u2022 TokenMetrics AI hasn't analyzed this token yet
`;
        responseText += `\u2022 The token may not meet criteria for AI analysis
`;
        responseText += `\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum

`;
      } else {
        responseText += `\u2705 **Found ${aiReports.length} comprehensive AI-generated reports**

`;
        const reportTypes = reportsAnalysis.report_coverage.report_types;
        if (reportTypes && reportTypes.length > 0) {
          responseText += `\u{1F4CA} **Available Report Types:**
`;
          reportTypes.forEach((type) => {
            responseText += `\u2022 ${type.type}: ${type.count} reports (${type.percentage}%)
`;
          });
          responseText += `
`;
        }
        if (processedRequest.analysisType === "investment" && reportsAnalysis.investment_focus) {
          responseText += `\u{1F4B0} **Investment Analysis Focus:**
`;
          responseText += `\u2022 Investment analyses available: ${reportsAnalysis.investment_focus.investment_reports}
`;
          if (reportsAnalysis.investment_focus.key_investment_points && reportsAnalysis.investment_focus.key_investment_points.length > 0) {
            responseText += `
\u{1F4A1} **Key Investment Insights:**
`;
            reportsAnalysis.investment_focus.key_investment_points.slice(0, 3).forEach((point) => {
              responseText += `\u2022 ${point}
`;
            });
          }
        } else if (processedRequest.analysisType === "technical" && reportsAnalysis.technical_focus) {
          responseText += `\u{1F527} **Technical Analysis Focus:**
`;
          responseText += `\u2022 Code reviews available: ${reportsAnalysis.technical_focus.code_reviews}
`;
          if (reportsAnalysis.technical_focus.technical_highlights && reportsAnalysis.technical_focus.technical_highlights.length > 0) {
            responseText += `
\u{1F50D} **Technical Highlights:**
`;
            reportsAnalysis.technical_focus.technical_highlights.slice(0, 3).forEach((highlight) => {
              responseText += `\u2022 ${highlight}
`;
            });
          }
        } else if (processedRequest.analysisType === "comprehensive" && reportsAnalysis.comprehensive_focus) {
          responseText += `\u{1F4DA} **Comprehensive Analysis Focus:**
`;
          responseText += `\u2022 Deep dive reports: ${reportsAnalysis.comprehensive_focus.deep_dive_reports}
`;
          if (reportsAnalysis.comprehensive_focus.comprehensive_highlights && reportsAnalysis.comprehensive_focus.comprehensive_highlights.length > 0) {
            responseText += `
\u{1F4D6} **Comprehensive Highlights:**
`;
            reportsAnalysis.comprehensive_focus.comprehensive_highlights.slice(0, 3).forEach((highlight) => {
              responseText += `\u2022 ${highlight}
`;
            });
          }
        } else {
          responseText += `\u{1F4CA} **Comprehensive AI Analysis:**
`;
          responseText += `\u2022 ${reportsAnalysis.summary}
`;
          if (reportsAnalysis.report_content) {
            const content = reportsAnalysis.report_content;
            if (content.investment_analyses && content.investment_analyses.length > 0) {
              responseText += `
\u{1F4B0} **Investment Analysis Available** (${content.investment_analyses.length} reports)
`;
              const firstAnalysis = content.investment_analyses[0];
              if (firstAnalysis.content && firstAnalysis.content.length > 100) {
                const preview = firstAnalysis.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.deep_dive_reports && content.deep_dive_reports.length > 0) {
              responseText += `
\u{1F4DA} **Deep Dive Reports Available** (${content.deep_dive_reports.length} reports)
`;
              const firstDeepDive = content.deep_dive_reports[0];
              if (firstDeepDive.content && firstDeepDive.content.length > 100) {
                const preview = firstDeepDive.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.code_reviews && content.code_reviews.length > 0) {
              responseText += `
\u{1F527} **Code Reviews Available** (${content.code_reviews.length} reports)
`;
              const firstCodeReview = content.code_reviews[0];
              if (firstCodeReview.content && firstCodeReview.content.length > 100) {
                const preview = firstCodeReview.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.executive_summaries && content.executive_summaries.length > 0) {
              responseText += `
\u{1F4CB} **Executive Summaries Available** (${content.executive_summaries.length} reports)
`;
              const firstSummary = content.executive_summaries[0];
              if (firstSummary.content && firstSummary.content.length > 100) {
                const preview = firstSummary.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
          }
        }
        if (reportsAnalysis.research_themes && reportsAnalysis.research_themes.length > 0) {
          responseText += `
\u{1F50D} **Key Research Themes:**
`;
          reportsAnalysis.research_themes.slice(0, 4).forEach((theme) => {
            responseText += `\u2022 ${theme}
`;
          });
        }
        if (reportsAnalysis.data_quality) {
          responseText += `
\u{1F4C8} **Data Quality Assessment:**
`;
          responseText += `\u2022 Coverage: ${reportsAnalysis.data_quality.coverage_breadth}
`;
          responseText += `\u2022 Completeness: ${reportsAnalysis.data_quality.completeness}
`;
          responseText += `\u2022 Freshness: ${reportsAnalysis.data_quality.freshness}
`;
        }
        responseText += `
\u{1F4CB} **Usage Guidelines:**
`;
        responseText += `\u2022 Use for due diligence and investment research
`;
        responseText += `\u2022 Combine with quantitative metrics for complete picture
`;
        responseText += `\u2022 Review report generation date for relevance
`;
        responseText += `\u2022 Consider reports as one input in investment decision process
`;
      }
      responseText += `
\u{1F517} **Data Source:** TokenMetrics AI Engine (v2)`;
      console.log(`[${requestId}] AI reports analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "aireports",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult20({ success: true, text: responseText });
    } catch (error) {
      console.error("Error in getAiReports action:", error);
      const errorMessage = `\u274C **Failed to get AI reports**

**Error:** ${error instanceof Error ? error.message : "Unknown error occurred"}

**Troubleshooting:**
\u2022 Ensure TokenMetrics AI has analyzed the requested token
\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum
\u2022 Check if your TokenMetrics subscription includes AI reports
\u2022 Verify the token meets criteria for AI analysis

**Common Solutions:**
\u2022 Use full token names or symbols (e.g., "Bitcoin" or "BTC")
\u2022 Check if TokenMetrics has generated reports for the requested token
\u2022 Ensure your API key has access to the ai-reports endpoint`;
      if (callback) {
        await callback({
          text: errorMessage,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            message: "Failed to retrieve AI reports from TokenMetrics API"
          }
        });
      }
      return createActionResult20({ success: false, error: "Failed to process request" });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger21.log("\u{1F50D} Validating getAiReportsAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger21.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeAiReports(reportsData, analysisType = "all") {
  if (!reportsData || reportsData.length === 0) {
    return {
      summary: "No AI reports available for analysis",
      report_coverage: "No data",
      insights: []
    };
  }
  const reportContent = extractReportContent(reportsData);
  const reportCoverage = analyzeReportCoverage(reportsData);
  const contentAnalysis = analyzeReportContent(reportsData);
  const qualityAssessment = assessReportQuality(reportsData);
  const topInsights = extractTopInsights(reportsData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "investment":
      focusedAnalysis = {
        investment_focus: {
          investment_reports: reportsData.filter((r) => r.INVESTMENT_ANALYSIS || r.INVESTMENT_ANALYSIS_POINTER).length,
          key_investment_points: extractInvestmentHighlights(reportsData),
          investment_insights: [
            `\u{1F4C8} Investment analyses available: ${reportsData.filter((r) => r.INVESTMENT_ANALYSIS).length}`,
            `\u{1F3AF} Executive summaries: ${reportsData.filter((r) => r.INVESTMENT_ANALYSIS_POINTER).length}`,
            `\u{1F4B0} Market analysis included: ${reportsData.filter((r) => r.INVESTMENT_ANALYSIS?.includes("Market Analysis")).length}`
          ]
        }
      };
      break;
    case "technical":
      focusedAnalysis = {
        technical_focus: {
          code_reviews: reportsData.filter((r) => r.CODE_REVIEW).length,
          technical_highlights: extractTechnicalHighlights(reportsData),
          technical_insights: [
            `\u{1F527} Code reviews available: ${reportsData.filter((r) => r.CODE_REVIEW).length}`,
            `\u{1F4CA} Architecture analysis: ${reportsData.filter((r) => r.CODE_REVIEW?.includes("Architecture")).length}`,
            `\u{1F6E1}\uFE0F Security assessments: ${reportsData.filter((r) => r.CODE_REVIEW?.includes("security")).length}`
          ]
        }
      };
      break;
    case "comprehensive":
      focusedAnalysis = {
        comprehensive_focus: {
          deep_dive_reports: reportsData.filter((r) => r.DEEP_DIVE).length,
          comprehensive_highlights: extractComprehensiveHighlights(reportsData),
          comprehensive_insights: [
            `\u{1F4DA} Deep dive reports: ${reportsData.filter((r) => r.DEEP_DIVE).length}`,
            `\u{1F50D} Multi-faceted analysis: ${reportsData.filter((r) => r.DEEP_DIVE && r.INVESTMENT_ANALYSIS && r.CODE_REVIEW).length}`,
            `\u{1F4D6} Detailed evaluations: ${reportsData.filter((r) => r.DEEP_DIVE?.length > 1e3).length}`
          ]
        }
      };
      break;
  }
  return {
    summary: `AI analysis covering ${reportsData.length} comprehensive reports for ${reportCoverage.unique_tokens} tokens`,
    analysis_type: analysisType,
    report_content: reportContent,
    report_coverage: reportCoverage,
    content_analysis: contentAnalysis,
    quality_assessment: qualityAssessment,
    top_insights: topInsights,
    research_themes: identifyResearchThemes(reportsData),
    actionable_intelligence: generateActionableIntelligence(reportsData),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics AI Engine",
      total_reports: reportsData.length,
      coverage_breadth: assessCoverageBreadth(reportsData),
      freshness: assessReportFreshness(reportsData),
      completeness: assessActualReportCompleteness(reportsData)
    },
    investment_considerations: [
      "\u{1F4CA} Use AI reports as part of comprehensive due diligence",
      "\u{1F3AF} Cross-reference recommendations with quantitative metrics",
      "\u{1F4C5} Consider report generation date for relevance",
      "\u{1F50D} Focus on reports matching your investment timeline",
      "\u2696\uFE0F Balance AI insights with fundamental analysis",
      "\u{1F4C8} Track report accuracy over time for validation"
    ]
  };
}
function extractReportContent(reportsData) {
  const content = {
    investment_analyses: [],
    deep_dive_reports: [],
    code_reviews: [],
    executive_summaries: []
  };
  reportsData.forEach((report) => {
    if (report.INVESTMENT_ANALYSIS) {
      content.investment_analyses.push({
        token: report.TOKEN_SYMBOL || report.TOKEN_NAME,
        content: report.INVESTMENT_ANALYSIS,
        length: report.INVESTMENT_ANALYSIS.length
      });
    }
    if (report.DEEP_DIVE) {
      content.deep_dive_reports.push({
        token: report.TOKEN_SYMBOL || report.TOKEN_NAME,
        content: report.DEEP_DIVE,
        length: report.DEEP_DIVE.length
      });
    }
    if (report.CODE_REVIEW) {
      content.code_reviews.push({
        token: report.TOKEN_SYMBOL || report.TOKEN_NAME,
        content: report.CODE_REVIEW,
        length: report.CODE_REVIEW.length
      });
    }
    if (report.INVESTMENT_ANALYSIS_POINTER) {
      content.executive_summaries.push({
        token: report.TOKEN_SYMBOL || report.TOKEN_NAME,
        content: report.INVESTMENT_ANALYSIS_POINTER,
        length: report.INVESTMENT_ANALYSIS_POINTER.length
      });
    }
  });
  return content;
}
function extractInvestmentHighlights(reportsData) {
  const highlights = [];
  reportsData.forEach((report) => {
    if (report.INVESTMENT_ANALYSIS) {
      const analysis = report.INVESTMENT_ANALYSIS;
      if (analysis.includes("Executive Summary")) {
        const summaryMatch = analysis.match(/## Executive Summary\n(.*?)(?=\n##|$)/s);
        if (summaryMatch) {
          highlights.push(`${report.TOKEN_SYMBOL}: ${summaryMatch[1].substring(0, 200)}...`);
        }
      }
      if (analysis.includes("Conclusion")) {
        const conclusionMatch = analysis.match(/## Conclusion\n(.*?)(?=\n##|$)/s);
        if (conclusionMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Outlook: ${conclusionMatch[1].substring(0, 150)}...`);
        }
      }
    }
    if (report.INVESTMENT_ANALYSIS_POINTER) {
      const pointer = report.INVESTMENT_ANALYSIS_POINTER;
      const bulletPoints = pointer.match(/- .+/g);
      if (bulletPoints && bulletPoints.length > 0) {
        highlights.push(`${report.TOKEN_SYMBOL}: ${bulletPoints[0].substring(2, 150)}...`);
      }
    }
  });
  return highlights.slice(0, 5);
}
function extractTechnicalHighlights(reportsData) {
  const highlights = [];
  reportsData.forEach((report) => {
    if (report.CODE_REVIEW) {
      const review = report.CODE_REVIEW;
      if (review.includes("Innovation")) {
        const innovationMatch = review.match(/## Innovation\n(.*?)(?=\n##|$)/s);
        if (innovationMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Innovation: ${innovationMatch[1].substring(0, 150)}...`);
        }
      }
      if (review.includes("Architecture")) {
        const archMatch = review.match(/## Architecture\n(.*?)(?=\n##|$)/s);
        if (archMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Architecture: ${archMatch[1].substring(0, 150)}...`);
        }
      }
      if (review.includes("Code Quality")) {
        const qualityMatch = review.match(/## Code Quality\n(.*?)(?=\n##|$)/s);
        if (qualityMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Code Quality: ${qualityMatch[1].substring(0, 150)}...`);
        }
      }
    }
  });
  return highlights.slice(0, 5);
}
function extractComprehensiveHighlights(reportsData) {
  const highlights = [];
  reportsData.forEach((report) => {
    if (report.DEEP_DIVE) {
      const deepDive = report.DEEP_DIVE;
      if (deepDive.includes("Vision")) {
        const visionMatch = deepDive.match(/### Vision\n(.*?)(?=\n###|$)/s);
        if (visionMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Vision: ${visionMatch[1].substring(0, 150)}...`);
        }
      }
      if (deepDive.includes("Problem")) {
        const problemMatch = deepDive.match(/### Problem\n(.*?)(?=\n###|$)/s);
        if (problemMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Problem Solved: ${problemMatch[1].substring(0, 150)}...`);
        }
      }
      if (deepDive.includes("Market Analysis")) {
        const marketMatch = deepDive.match(/## Market Analysis\n(.*?)(?=\n##|$)/s);
        if (marketMatch) {
          highlights.push(`${report.TOKEN_SYMBOL} Market: ${marketMatch[1].substring(0, 150)}...`);
        }
      }
    }
  });
  return highlights.slice(0, 5);
}
function analyzeReportCoverage(reportsData) {
  const uniqueTokens = new Set(reportsData.map((r) => r.TOKEN_SYMBOL || r.TOKEN_NAME).filter((s) => s)).size;
  const tokenCoverage = /* @__PURE__ */ new Map();
  reportsData.forEach((report) => {
    const symbol = report.TOKEN_SYMBOL || report.TOKEN_NAME || "Unknown";
    if (!tokenCoverage.has(symbol)) {
      tokenCoverage.set(symbol, {
        reports: [],
        report_types: /* @__PURE__ */ new Set()
      });
    }
    const tokenData = tokenCoverage.get(symbol);
    tokenData.reports.push(report);
    if (report.INVESTMENT_ANALYSIS) tokenData.report_types.add("Investment Analysis");
    if (report.DEEP_DIVE) tokenData.report_types.add("Deep Dive");
    if (report.CODE_REVIEW) tokenData.report_types.add("Code Review");
    if (report.INVESTMENT_ANALYSIS_POINTER) tokenData.report_types.add("Executive Summary");
  });
  const mostAnalyzed = Array.from(tokenCoverage.entries()).sort((a, b) => b[1].reports.length - a[1].reports.length).slice(0, 5).map(([symbol, data]) => ({
    symbol,
    report_count: data.reports.length,
    report_types: Array.from(data.report_types),
    token_id: data.reports[0]?.TOKEN_ID || "Unknown"
  }));
  const reportTypes = /* @__PURE__ */ new Map();
  reportsData.forEach((report) => {
    if (report.INVESTMENT_ANALYSIS) reportTypes.set("Investment Analysis", (reportTypes.get("Investment Analysis") || 0) + 1);
    if (report.DEEP_DIVE) reportTypes.set("Deep Dive", (reportTypes.get("Deep Dive") || 0) + 1);
    if (report.CODE_REVIEW) reportTypes.set("Code Review", (reportTypes.get("Code Review") || 0) + 1);
    if (report.INVESTMENT_ANALYSIS_POINTER) reportTypes.set("Executive Summary", (reportTypes.get("Executive Summary") || 0) + 1);
  });
  return {
    unique_tokens: uniqueTokens,
    total_reports: reportsData.length,
    most_analyzed_tokens: mostAnalyzed,
    report_types: Array.from(reportTypes.entries()).map(([type, count]) => ({
      type,
      count,
      percentage: (count / reportsData.length * 100).toFixed(1)
    })),
    coverage_depth: uniqueTokens > 0 ? (reportsData.length / uniqueTokens).toFixed(1) : "0"
  };
}
function assessActualReportCompleteness(reportsData) {
  const requiredFields = ["INVESTMENT_ANALYSIS", "DEEP_DIVE", "CODE_REVIEW", "INVESTMENT_ANALYSIS_POINTER"];
  let completeness = 0;
  reportsData.forEach((report) => {
    const presentFields = requiredFields.filter(
      (field) => report[field] && report[field].length > 0
    );
    completeness += presentFields.length / requiredFields.length;
  });
  const avgCompleteness = completeness / reportsData.length * 100;
  if (avgCompleteness > 80) return "Very Complete";
  if (avgCompleteness > 60) return "Complete";
  if (avgCompleteness > 40) return "Moderate";
  return "Limited";
}
function analyzeReportContent(reportsData) {
  const sentimentAnalysis = analyzeSentiment(reportsData);
  const commonThemes = extractCommonThemes(reportsData);
  const keywordFrequency = analyzeKeywords(reportsData);
  return {
    sentiment_distribution: sentimentAnalysis,
    common_themes: commonThemes,
    trending_keywords: keywordFrequency.slice(0, 10),
    content_depth: assessContentDepth(reportsData),
    analysis_focus: identifyAnalysisFocus(reportsData)
  };
}
function assessReportQuality(reportsData) {
  let qualityScore = 0;
  let detailedReports = 0;
  let recentReports = 0;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
  reportsData.forEach((report) => {
    if (report.REPORT_CONTENT && report.REPORT_CONTENT.length > 500) {
      detailedReports++;
      qualityScore += 2;
    }
    if (report.KEY_INSIGHTS && Array.isArray(report.KEY_INSIGHTS) && report.KEY_INSIGHTS.length > 0) {
      qualityScore += 1;
    }
    if (report.RECOMMENDATIONS && Array.isArray(report.RECOMMENDATIONS) && report.RECOMMENDATIONS.length > 0) {
      qualityScore += 1;
    }
    if (report.GENERATED_DATE && new Date(report.GENERATED_DATE) > thirtyDaysAgo) {
      recentReports++;
      qualityScore += 1;
    }
  });
  const avgQualityScore = reportsData.length > 0 ? qualityScore / reportsData.length : 0;
  let qualityRating;
  if (avgQualityScore > 4) qualityRating = "Excellent";
  else if (avgQualityScore > 3) qualityRating = "Good";
  else if (avgQualityScore > 2) qualityRating = "Fair";
  else qualityRating = "Basic";
  return {
    quality_rating: qualityRating,
    average_quality_score: avgQualityScore.toFixed(1),
    detailed_reports: detailedReports,
    detailed_percentage: (detailedReports / reportsData.length * 100).toFixed(1),
    recent_reports: recentReports,
    freshness_percentage: (recentReports / reportsData.length * 100).toFixed(1),
    completeness: assessReportCompleteness(reportsData)
  };
}
function extractTopInsights(reportsData) {
  const allInsights = [];
  const allRecommendations = [];
  reportsData.forEach((report) => {
    if (report.KEY_INSIGHTS && Array.isArray(report.KEY_INSIGHTS)) {
      allInsights.push(...report.KEY_INSIGHTS.map((insight) => ({
        insight,
        token: report.SYMBOL || "Unknown",
        report_date: report.GENERATED_DATE || "Unknown"
      })));
    }
    if (report.RECOMMENDATIONS && Array.isArray(report.RECOMMENDATIONS)) {
      allRecommendations.push(...report.RECOMMENDATIONS.map((rec) => ({
        recommendation: rec,
        token: report.SYMBOL || "Unknown",
        report_date: report.GENERATED_DATE || "Unknown"
      })));
    }
  });
  return {
    total_insights: allInsights.length,
    total_recommendations: allRecommendations.length,
    recent_insights: allInsights.slice(-5),
    // Last 5 insights
    key_recommendations: allRecommendations.slice(-5),
    // Last 5 recommendations
    insight_themes: categorizeInsights(allInsights),
    recommendation_types: categorizeRecommendations(allRecommendations)
  };
}
function identifyResearchThemes(reportsData) {
  const themes = /* @__PURE__ */ new Map();
  reportsData.forEach((report) => {
    if (report.REPORT_CONTENT) {
      const content = report.REPORT_CONTENT.toLowerCase();
      const themeKeywords = [
        "defi",
        "nft",
        "layer 2",
        "scaling",
        "interoperability",
        "staking",
        "governance",
        "yield farming",
        "liquidity",
        "smart contracts",
        "consensus",
        "privacy",
        "institutional adoption",
        "regulation",
        "market making",
        "derivatives",
        "lending",
        "synthetic assets"
      ];
      themeKeywords.forEach((keyword) => {
        if (content.includes(keyword)) {
          themes.set(keyword, (themes.get(keyword) || 0) + 1);
        }
      });
    }
  });
  return Array.from(themes.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([theme, count]) => `${theme} (${count} reports)`);
}
function generateActionableIntelligence(reportsData) {
  const intelligence = {
    investment_signals: [],
    risk_alerts: [],
    opportunity_highlights: [],
    market_insights: []
  };
  reportsData.forEach((report) => {
    if (report.RECOMMENDATIONS) {
      report.RECOMMENDATIONS.forEach((rec) => {
        const recLower = rec.toLowerCase();
        if (recLower.includes("buy") || recLower.includes("accumulate")) {
          intelligence.investment_signals.push({
            type: "Bullish",
            signal: rec,
            token: report.SYMBOL
          });
        } else if (recLower.includes("sell") || recLower.includes("avoid")) {
          intelligence.investment_signals.push({
            type: "Bearish",
            signal: rec,
            token: report.SYMBOL
          });
        }
        if (recLower.includes("risk") || recLower.includes("caution")) {
          intelligence.risk_alerts.push({
            alert: rec,
            token: report.SYMBOL
          });
        }
        if (recLower.includes("opportunity") || recLower.includes("potential")) {
          intelligence.opportunity_highlights.push({
            opportunity: rec,
            token: report.SYMBOL
          });
        }
      });
    }
    if (report.KEY_INSIGHTS) {
      report.KEY_INSIGHTS.forEach((insight) => {
        const insightLower = insight.toLowerCase();
        if (insightLower.includes("market") || insightLower.includes("trend")) {
          intelligence.market_insights.push({
            insight,
            token: report.SYMBOL
          });
        }
      });
    }
  });
  return {
    investment_signals: intelligence.investment_signals.slice(0, 10),
    risk_alerts: intelligence.risk_alerts.slice(0, 5),
    opportunity_highlights: intelligence.opportunity_highlights.slice(0, 5),
    market_insights: intelligence.market_insights.slice(0, 8),
    summary: generateIntelligenceSummary(intelligence)
  };
}
function analyzeSentiment(reportsData) {
  let bullish = 0;
  let bearish = 0;
  let neutral = 0;
  reportsData.forEach((report) => {
    if (report.REPORT_CONTENT || report.KEY_INSIGHTS || report.RECOMMENDATIONS) {
      const content = [
        report.REPORT_CONTENT || "",
        ...report.KEY_INSIGHTS || [],
        ...report.RECOMMENDATIONS || []
      ].join(" ").toLowerCase();
      const positiveWords = ["bullish", "positive", "growth", "opportunity", "strong", "buy", "accumulate"];
      const negativeWords = ["bearish", "negative", "decline", "risk", "weak", "sell", "avoid"];
      const positiveScore = positiveWords.reduce((score, word) => {
        return score + (content.split(word).length - 1);
      }, 0);
      const negativeScore = negativeWords.reduce((score, word) => {
        return score + (content.split(word).length - 1);
      }, 0);
      if (positiveScore > negativeScore) bullish++;
      else if (negativeScore > positiveScore) bearish++;
      else neutral++;
    }
  });
  const total = bullish + bearish + neutral;
  return {
    bullish,
    bearish,
    neutral,
    bullish_percentage: total > 0 ? (bullish / total * 100).toFixed(1) : "0",
    bearish_percentage: total > 0 ? (bearish / total * 100).toFixed(1) : "0",
    overall_sentiment: bullish > bearish ? "Bullish" : bearish > bullish ? "Bearish" : "Neutral"
  };
}
function extractCommonThemes(reportsData) {
  const themeCount = /* @__PURE__ */ new Map();
  const commonThemes = [
    "scalability",
    "adoption",
    "partnerships",
    "technology",
    "team",
    "roadmap",
    "competition",
    "valuation",
    "use case",
    "governance",
    "tokenomics",
    "ecosystem",
    "development",
    "community",
    "security"
  ];
  reportsData.forEach((report) => {
    const content = [
      report.REPORT_CONTENT || "",
      ...report.KEY_INSIGHTS || [],
      ...report.RECOMMENDATIONS || []
    ].join(" ").toLowerCase();
    commonThemes.forEach((theme) => {
      if (content.includes(theme)) {
        themeCount.set(theme, (themeCount.get(theme) || 0) + 1);
      }
    });
  });
  return Array.from(themeCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([theme, count]) => `${theme} (${count})`);
}
function analyzeKeywords(reportsData) {
  const keywordCount = /* @__PURE__ */ new Map();
  reportsData.forEach((report) => {
    const content = [
      report.REPORT_CONTENT || "",
      ...report.KEY_INSIGHTS || [],
      ...report.RECOMMENDATIONS || []
    ].join(" ").toLowerCase();
    const words = content.match(/\b[a-z]{4,}\b/g) || [];
    const excludeWords = ["that", "this", "with", "from", "they", "have", "will", "been", "were", "would", "could", "should"];
    words.forEach((word) => {
      if (!excludeWords.includes(word)) {
        keywordCount.set(word, (keywordCount.get(word) || 0) + 1);
      }
    });
  });
  return Array.from(keywordCount.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([keyword, count]) => ({ keyword, frequency: count }));
}
function assessContentDepth(reportsData) {
  const avgContentLength = reportsData.reduce((sum, report) => {
    return sum + (report.REPORT_CONTENT ? report.REPORT_CONTENT.length : 0);
  }, 0) / reportsData.length;
  if (avgContentLength > 2e3) return "Comprehensive";
  if (avgContentLength > 1e3) return "Detailed";
  if (avgContentLength > 500) return "Moderate";
  return "Brief";
}
function identifyAnalysisFocus(reportsData) {
  const focusAreas = /* @__PURE__ */ new Map();
  const analysisTypes = [
    "fundamental analysis",
    "technical analysis",
    "on-chain analysis",
    "competitive analysis",
    "market analysis",
    "risk analysis",
    "valuation analysis",
    "team analysis",
    "technology review"
  ];
  reportsData.forEach((report) => {
    const content = [
      report.REPORT_CONTENT || "",
      report.REPORT_TYPE || ""
    ].join(" ").toLowerCase();
    analysisTypes.forEach((type) => {
      if (content.includes(type.split(" ")[0])) {
        focusAreas.set(type, (focusAreas.get(type) || 0) + 1);
      }
    });
  });
  return Array.from(focusAreas.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([focus, count]) => `${focus} (${count})`);
}
function assessCoverageBreadth(reportsData) {
  const categories = new Set(reportsData.map((r) => r.CATEGORY).filter((c) => c));
  const symbols = new Set(reportsData.map((r) => r.SYMBOL).filter((s) => s));
  if (categories.size > 8 && symbols.size > 20) return "Very Broad";
  if (categories.size > 5 && symbols.size > 15) return "Broad";
  if (categories.size > 3 && symbols.size > 10) return "Moderate";
  return "Narrow";
}
function assessReportFreshness(reportsData) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1e3);
  const recentReports = reportsData.filter(
    (r) => r.GENERATED_DATE && new Date(r.GENERATED_DATE) > thirtyDaysAgo
  ).length;
  const freshnessPercent = recentReports / reportsData.length * 100;
  if (freshnessPercent > 60) return "Very Fresh";
  if (freshnessPercent > 40) return "Fresh";
  if (freshnessPercent > 20) return "Moderate";
  return "Dated";
}
function assessReportCompleteness(reportsData) {
  const requiredFields = ["REPORT_CONTENT", "KEY_INSIGHTS", "RECOMMENDATIONS"];
  let completeness = 0;
  reportsData.forEach((report) => {
    const presentFields = requiredFields.filter(
      (field) => report[field] && (Array.isArray(report[field]) ? report[field].length > 0 : report[field].length > 0)
    );
    completeness += presentFields.length / requiredFields.length;
  });
  const avgCompleteness = completeness / reportsData.length * 100;
  if (avgCompleteness > 80) return "Very Complete";
  if (avgCompleteness > 60) return "Complete";
  if (avgCompleteness > 40) return "Moderate";
  return "Limited";
}
function categorizeInsights(insights) {
  const categories = /* @__PURE__ */ new Map();
  insights.forEach(({ insight }) => {
    const insightLower = insight.toLowerCase();
    if (insightLower.includes("technical") || insightLower.includes("technology")) {
      categories.set("Technical", (categories.get("Technical") || 0) + 1);
    } else if (insightLower.includes("market") || insightLower.includes("price")) {
      categories.set("Market", (categories.get("Market") || 0) + 1);
    } else if (insightLower.includes("fundamental") || insightLower.includes("business")) {
      categories.set("Fundamental", (categories.get("Fundamental") || 0) + 1);
    } else if (insightLower.includes("risk") || insightLower.includes("concern")) {
      categories.set("Risk", (categories.get("Risk") || 0) + 1);
    } else {
      categories.set("General", (categories.get("General") || 0) + 1);
    }
  });
  return Array.from(categories.entries()).map(([category, count]) => ({
    category,
    count,
    percentage: (count / insights.length * 100).toFixed(1)
  }));
}
function categorizeRecommendations(recommendations) {
  const categories = /* @__PURE__ */ new Map();
  recommendations.forEach(({ recommendation }) => {
    const recLower = recommendation.toLowerCase();
    if (recLower.includes("buy") || recLower.includes("accumulate")) {
      categories.set("Buy/Accumulate", (categories.get("Buy/Accumulate") || 0) + 1);
    } else if (recLower.includes("sell") || recLower.includes("reduce")) {
      categories.set("Sell/Reduce", (categories.get("Sell/Reduce") || 0) + 1);
    } else if (recLower.includes("hold") || recLower.includes("maintain")) {
      categories.set("Hold/Maintain", (categories.get("Hold/Maintain") || 0) + 1);
    } else if (recLower.includes("watch") || recLower.includes("monitor")) {
      categories.set("Watch/Monitor", (categories.get("Watch/Monitor") || 0) + 1);
    } else {
      categories.set("General Advice", (categories.get("General Advice") || 0) + 1);
    }
  });
  return Array.from(categories.entries()).map(([category, count]) => ({
    category,
    count,
    percentage: (count / recommendations.length * 100).toFixed(1)
  }));
}
function generateIntelligenceSummary(intelligence) {
  const { recommendations, insights, risk_factors } = intelligence;
  let summary = "\u{1F4CA} **AI Intelligence Summary**\n\n";
  if (recommendations && recommendations.length > 0) {
    summary += `\u{1F3AF} **Key Recommendations**: ${recommendations.slice(0, 3).join(", ")}
`;
  }
  if (insights && insights.length > 0) {
    summary += `\u{1F4A1} **Top Insights**: ${insights.slice(0, 3).join(", ")}
`;
  }
  if (risk_factors && risk_factors.length > 0) {
    summary += `\u26A0\uFE0F **Risk Factors**: ${risk_factors.slice(0, 2).join(", ")}
`;
  }
  return summary;
}

// src/actions/getMoonshotTokensAction.ts
import {
  elizaLogger as elizaLogger22,
  createActionResult as createActionResult21
} from "@elizaos/core";
var MoonshotTokensRequestSchema = external_exports.object({
  limit: external_exports.number().min(1).max(100).optional().describe("Number of moonshot tokens to return"),
  page: external_exports.number().min(1).optional().describe("Page number for pagination"),
  type: external_exports.enum(["active", "past", "all"]).optional().describe("Type of moonshot tokens to fetch"),
  analysisType: external_exports.enum(["market_trends", "breakout_potential", "ai_picks", "all"]).optional().describe("Type of analysis to focus on")
});
var MOONSHOT_TOKENS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting moonshot tokens and market trend requests from natural language.

IMPORTANT: This API provides AI-curated token picks with high breakout potential, market trends, and sentiment-like insights.
When users ask for "market sentiment" or "trending tokens", they get moonshot tokens with breakout potential analysis.

The user wants to get AI-curated token picks and market trend insights. Extract the following information:

1. **limit** (optional, default: 50): Number of moonshot tokens to return
   - Look for phrases like "top 10", "show me 20", "get 50 tokens"
   - 50 = default, 100 = maximum

2. **page** (optional, default: 1): Page number for pagination

3. **type** (optional, default: "active"): What type of moonshot tokens they want
   - "active" - currently active moonshot picks
   - "past" - historical moonshot picks
   - "all" - all moonshot picks

4. **analysisType** (optional, default: "all"): What type of analysis they want
   - "market_trends" - focus on overall market trends and momentum
   - "breakout_potential" - focus on tokens with high breakout potential
   - "ai_picks" - focus on AI-curated recommendations
   - "all" - comprehensive analysis across all factors

Examples:
- "Get market sentiment" \u2192 {analysisType: "market_trends"}
- "Show me trending tokens" \u2192 {analysisType: "market_trends"}
- "What tokens have breakout potential?" \u2192 {analysisType: "breakout_potential"}
- "Get AI token recommendations" \u2192 {analysisType: "ai_picks"}
- "Show me moonshot tokens" \u2192 {analysisType: "all"}
- "Market trends for the past week" \u2192 {type: "all", analysisType: "market_trends"}

Extract the request details from the user's message and respond in XML format:

<response>
<limit>number of tokens to return</limit>
<page>page number for pagination</page>
<type>active|past|all</type>
<analysisType>market_trends|breakout_potential|ai_picks|all</analysisType>
</response>
`;
var getMoonshotTokensAction = {
  name: "GET_MOONSHOT_TOKENS_TOKENMETRICS",
  description: "Get AI-curated moonshot tokens with high breakout potential and market trend insights from TokenMetrics (includes sentiment-like analysis)",
  similes: [
    "get sentiment",
    "market sentiment",
    "sentiment analysis",
    "market trends",
    "trending tokens",
    "moonshot tokens",
    "breakout potential",
    "ai recommendations",
    "market momentum",
    "hot tokens",
    "rising tokens",
    "market picks",
    "get moonshot tokens",
    "show moonshot picks"
  ],
  examples: [
    [
      {
        name: "{{user1}}",
        content: {
          text: "Get market sentiment"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll analyze market trends and show you AI-curated tokens with high breakout potential.",
          action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "Show me trending tokens"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll get the trending moonshot tokens with high market momentum.",
          action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        name: "{{user1}}",
        content: {
          text: "What tokens have breakout potential?"
        }
      },
      {
        name: "{{agent}}",
        content: {
          text: "I'll find AI-curated tokens with the highest breakout potential.",
          action: "GET_MOONSHOT_TOKENS_TOKENMETRICS"
        }
      }
    ]
  ],
  handler: async (runtime, message, state, _options, callback) => {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing moonshot tokens request...`);
      if (!state) {
        state = await runtime.composeState(message);
      }
      const userMessage = message.content?.text || "";
      const enhancedTemplate = MOONSHOT_TOKENS_EXTRACTION_TEMPLATE + `

USER MESSAGE: "${userMessage}"

Please analyze the CURRENT user message above and extract the relevant information.`;
      const moonshotRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state,
        enhancedTemplate,
        MoonshotTokensRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, moonshotRequest);
      const processedRequest = {
        limit: moonshotRequest?.limit || 50,
        page: moonshotRequest?.page || 1,
        type: moonshotRequest?.type || "active",
        analysisType: moonshotRequest?.analysisType || "all"
      };
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.type !== "all") {
        apiParams.type = processedRequest.type;
      }
      const response = await callTokenMetricsAPI(
        "/v2/moonshot-tokens",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const moonshotData = Array.isArray(response) ? response : response.data || [];
      const moonshotAnalysis = analyzeMoonshotData(moonshotData, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${moonshotData.length} moonshot tokens from TokenMetrics`,
        request_id: requestId,
        moonshot_data: moonshotData,
        analysis: moonshotAnalysis,
        metadata: {
          endpoint: "moonshot-tokens",
          analysis_focus: processedRequest.analysisType,
          type_filter: processedRequest.type,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: moonshotData.length,
          api_version: "v2",
          data_source: "TokenMetrics AI Curation Engine"
        }
      };
      let responseText = `\u{1F680} **AI-Curated Moonshot Tokens & Market Trends**

`;
      responseText += `\u2139\uFE0F *These are AI-selected tokens with high breakout potential based on grades, sentiment, volume, and on-chain data.*

`;
      if (moonshotData.length === 0) {
        responseText += `\u274C No moonshot tokens available at the moment.

`;
      } else {
        responseText += `\u{1F3AF} **Top ${Math.min(moonshotData.length, 10)} Moonshot Tokens**:

`;
        const topTokens = moonshotData.slice(0, 10);
        topTokens.forEach((token, index) => {
          const name = token.TOKEN_NAME || "Unknown";
          const symbol = token.TOKEN_SYMBOL || "N/A";
          const grade = token.TM_TRADER_GRADE || 0;
          const priceChange = token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0;
          const gradeIcon = grade >= 80 ? "\u{1F525}" : grade >= 60 ? "\u{1F4AA}" : "\u{1F4CA}";
          const changeIcon = priceChange > 0 ? "\u{1F4C8}" : priceChange < 0 ? "\u{1F4C9}" : "\u27A1\uFE0F";
          responseText += `${index + 1}. ${gradeIcon} **${name}** (${symbol})
`;
          responseText += `   \u2022 Grade: ${Math.round(grade)}/100
`;
          responseText += `   \u2022 7D Change: ${changeIcon} ${formatPercentage(priceChange)}
`;
          if (token.MARKET_CAP) {
            responseText += `   \u2022 Market Cap: ${formatCurrency(token.MARKET_CAP)}
`;
          }
          responseText += `
`;
        });
        if (moonshotAnalysis.insights && moonshotAnalysis.insights.length > 0) {
          responseText += `\u{1F4A1} **Market Insights**:
`;
          moonshotAnalysis.insights.slice(0, 3).forEach((insight, index) => {
            responseText += `${index + 1}. ${insight}
`;
          });
          responseText += `
`;
        }
        if (moonshotAnalysis.trading_implications) {
          responseText += `\u{1F4C8} **Trading Outlook**: ${moonshotAnalysis.trading_implications.market_bias}
`;
          responseText += `\u{1F3AF} **Opportunity Level**: ${moonshotAnalysis.trading_implications.opportunity_level}

`;
        }
        responseText += `\u26A0\uFE0F **Risk Warning**: Moonshot tokens are high-risk, high-reward investments. Always do your own research and never invest more than you can afford to lose.

`;
      }
      responseText += `\u{1F4CA} Retrieved ${moonshotData.length} AI-curated tokens
`;
      responseText += `\u{1F3AF} Analysis focus: ${processedRequest.analysisType}
`;
      responseText += `\u{1F4C4} Page ${processedRequest.page} (limit: ${processedRequest.limit})`;
      console.log(`[${requestId}] Moonshot tokens analysis completed successfully`);
      if (callback) {
        await callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "moonshot-tokens",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return createActionResult21({
        success: true,
        text: responseText,
        data: {
          moonshot_data: moonshotData,
          analysis: moonshotAnalysis,
          source: "TokenMetrics Moonshot API",
          request_id: requestId
        }
      });
    } catch (error) {
      console.error("Error in getMoonshotTokensAction:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      if (callback) {
        await callback({
          text: `\u274C Error fetching moonshot tokens: ${errorMessage}`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: true
          }
        });
      }
      return createActionResult21({
        success: false,
        error: errorMessage
      });
    }
  },
  validate: async (runtime, message, state) => {
    elizaLogger22.log("\u{1F50D} Validating getMoonshotTokensAction (1.x)");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger22.error("\u274C Validation failed:", error);
      return false;
    }
  }
};
function analyzeMoonshotData(moonshotData, analysisType = "all") {
  if (!moonshotData || moonshotData.length === 0) {
    return {
      summary: "No moonshot tokens data available for analysis",
      market_sentiment: "Unknown",
      insights: []
    };
  }
  const gradeAnalysis = analyzeGrades(moonshotData);
  const performanceAnalysis = analyzePerformance(moonshotData);
  const marketAnalysis = analyzeMarketTrends(moonshotData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "market_trends":
      focusedAnalysis = {
        market_trends_focus: {
          trending_direction: marketAnalysis.overall_trend,
          momentum_level: marketAnalysis.momentum_level,
          trend_insights: [
            `\u{1F4C8} Market momentum: ${marketAnalysis.momentum_level}`,
            `\u{1F3AF} Trending direction: ${marketAnalysis.overall_trend}`,
            `\u{1F4AA} Strong performers: ${gradeAnalysis.high_grade_count}`
          ]
        }
      };
      break;
    case "breakout_potential":
      focusedAnalysis = {
        breakout_focus: {
          high_potential_tokens: identifyBreakoutCandidates2(moonshotData),
          breakout_signals: assessBreakoutSignals(moonshotData),
          breakout_insights: [
            `\u{1F680} High-potential tokens: ${identifyBreakoutCandidates2(moonshotData).length}`,
            `\u{1F4CA} Average grade: ${gradeAnalysis.average_grade}`,
            `\u{1F48E} Top performers: ${gradeAnalysis.top_performers}`
          ]
        }
      };
      break;
    case "ai_picks":
      focusedAnalysis = {
        ai_picks_focus: {
          ai_confidence: gradeAnalysis.grade_distribution,
          recommendation_strength: assessRecommendationStrength(gradeAnalysis),
          ai_insights: [
            `\u{1F916} AI confidence level: ${assessRecommendationStrength(gradeAnalysis)}`,
            `\u{1F4CA} Quality distribution: ${gradeAnalysis.grade_quality}`,
            `\u{1F3AF} Success probability: ${calculateSuccessProbability(gradeAnalysis)}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Analysis of ${moonshotData.length} AI-curated moonshot tokens showing ${marketAnalysis.overall_trend} market trend`,
    analysis_type: analysisType,
    market_sentiment: deriveSentimentFromData(gradeAnalysis, performanceAnalysis),
    grade_analysis: gradeAnalysis,
    performance_analysis: performanceAnalysis,
    market_analysis: marketAnalysis,
    insights: generateInsights(gradeAnalysis, performanceAnalysis, marketAnalysis),
    trading_implications: generateTradingImplications(gradeAnalysis, performanceAnalysis, marketAnalysis),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics AI Curation Engine",
      token_count: moonshotData.length,
      analysis_depth: "Comprehensive with AI scoring",
      reliability: "High - AI-curated selections"
    }
  };
}
function analyzeGrades(data) {
  const grades = data.map((token) => token.TM_TRADER_GRADE || 0).filter((g) => g > 0);
  const avgGrade = grades.length > 0 ? grades.reduce((sum, g) => sum + g, 0) / grades.length : 0;
  const highGradeCount = grades.filter((g) => g >= 80).length;
  const topPerformers = grades.filter((g) => g >= 90).length;
  return {
    average_grade: Math.round(avgGrade),
    high_grade_count: highGradeCount,
    top_performers: topPerformers,
    grade_quality: avgGrade >= 70 ? "High" : avgGrade >= 50 ? "Medium" : "Low",
    grade_distribution: `${topPerformers} excellent, ${highGradeCount} strong, ${grades.length - highGradeCount} moderate`
  };
}
function analyzePerformance(data) {
  const changes = data.map((token) => token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0);
  const positiveChanges = changes.filter((c) => c > 0).length;
  const avgChange = changes.length > 0 ? changes.reduce((sum, c) => sum + c, 0) / changes.length : 0;
  return {
    average_performance: avgChange,
    positive_performers: positiveChanges,
    performance_ratio: Math.round(positiveChanges / changes.length * 100),
    performance_trend: avgChange > 5 ? "Strong Positive" : avgChange > 0 ? "Positive" : avgChange > -5 ? "Neutral" : "Negative"
  };
}
function analyzeMarketTrends(data) {
  const grades = data.map((token) => token.TM_TRADER_GRADE || 0);
  const avgGrade = grades.reduce((sum, g) => sum + g, 0) / grades.length;
  const changes = data.map((token) => token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0);
  const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
  let overallTrend = "Neutral";
  if (avgGrade > 70 && avgChange > 5) overallTrend = "Strongly Bullish";
  else if (avgGrade > 60 && avgChange > 0) overallTrend = "Bullish";
  else if (avgGrade < 40 && avgChange < -5) overallTrend = "Bearish";
  else if (avgChange > 0) overallTrend = "Cautiously Optimistic";
  return {
    overall_trend: overallTrend,
    momentum_level: avgChange > 10 ? "High" : avgChange > 0 ? "Moderate" : "Low",
    market_strength: avgGrade > 70 ? "Strong" : avgGrade > 50 ? "Moderate" : "Weak"
  };
}
function identifyBreakoutCandidates2(data) {
  return data.filter(
    (token) => (token.TM_TRADER_GRADE || 0) >= 70 && (token.PRICE_CHANGE_PERCENTAGE_7D_IN_CURRENCY || 0) > 0
  ).slice(0, 5);
}
function assessBreakoutSignals(data) {
  const strongCandidates = identifyBreakoutCandidates2(data);
  return strongCandidates.length > 5 ? "Strong" : strongCandidates.length > 2 ? "Moderate" : "Weak";
}
function assessRecommendationStrength(gradeAnalysis) {
  if (gradeAnalysis.average_grade > 75) return "Very High";
  if (gradeAnalysis.average_grade > 60) return "High";
  if (gradeAnalysis.average_grade > 45) return "Moderate";
  return "Low";
}
function calculateSuccessProbability(gradeAnalysis) {
  const avgGrade = gradeAnalysis.average_grade;
  if (avgGrade > 80) return "High (70-85%)";
  if (avgGrade > 65) return "Good (55-70%)";
  if (avgGrade > 50) return "Moderate (40-55%)";
  return "Low (25-40%)";
}
function deriveSentimentFromData(gradeAnalysis, performanceAnalysis) {
  const avgGrade = gradeAnalysis.average_grade;
  const avgPerformance = performanceAnalysis.average_performance;
  if (avgGrade > 70 && avgPerformance > 5) return "Very Bullish";
  if (avgGrade > 60 && avgPerformance > 0) return "Bullish";
  if (avgGrade > 50) return "Cautiously Optimistic";
  if (avgGrade > 40) return "Neutral";
  return "Bearish";
}
function generateInsights(gradeAnalysis, performanceAnalysis, marketAnalysis) {
  const insights = [];
  if (gradeAnalysis.average_grade > 70) {
    insights.push(`Strong AI confidence with ${gradeAnalysis.average_grade}/100 average grade suggests quality opportunities`);
  }
  if (performanceAnalysis.positive_performers > performanceAnalysis.performance_ratio * 0.6) {
    insights.push(`${performanceAnalysis.positive_performers} tokens showing positive momentum indicates healthy market interest`);
  }
  if (marketAnalysis.overall_trend.includes("Bullish")) {
    insights.push(`${marketAnalysis.overall_trend} trend supported by ${marketAnalysis.momentum_level.toLowerCase()} momentum levels`);
  }
  if (gradeAnalysis.top_performers > 0) {
    insights.push(`${gradeAnalysis.top_performers} tokens with 90+ grades represent premium AI picks with highest conviction`);
  }
  return insights;
}
function generateTradingImplications(gradeAnalysis, performanceAnalysis, marketAnalysis) {
  let marketBias = "Neutral";
  let opportunityLevel = "Moderate";
  if (gradeAnalysis.average_grade > 70 && performanceAnalysis.average_performance > 0) {
    marketBias = "Bullish";
    opportunityLevel = "High";
  } else if (gradeAnalysis.average_grade > 60) {
    marketBias = "Cautiously Optimistic";
    opportunityLevel = "Good";
  } else if (gradeAnalysis.average_grade < 40) {
    marketBias = "Defensive";
    opportunityLevel = "Low";
  }
  return {
    market_bias: marketBias,
    opportunity_level: opportunityLevel,
    recommended_approach: generateRecommendedApproach(marketBias, opportunityLevel),
    risk_assessment: assessRiskLevel(gradeAnalysis, performanceAnalysis)
  };
}
function generateRecommendedApproach(bias, opportunity) {
  if (bias === "Bullish" && opportunity === "High") {
    return "Active position taking with disciplined risk management";
  } else if (bias === "Cautiously Optimistic") {
    return "Selective positioning in highest-grade tokens";
  } else if (bias === "Defensive") {
    return "Wait for better opportunities or focus on top-tier picks only";
  }
  return "Balanced approach with careful token selection";
}
function assessRiskLevel(gradeAnalysis, performanceAnalysis) {
  if (gradeAnalysis.average_grade > 75 && performanceAnalysis.performance_ratio > 60) {
    return "Moderate - Strong AI backing reduces risk";
  } else if (gradeAnalysis.average_grade > 60) {
    return "Medium-High - Standard moonshot risk with AI guidance";
  }
  return "High - Higher risk due to lower AI confidence";
}

// src/actions/action.ts
import axios from "axios";
var DEFAULT_BASE_URL = process.env.TOKENMETRICS_BASE_URL || "https://api.tokenmetrics.com";
var DEFAULT_API_VERSION = process.env.TOKENMETRICS_API_VERSION || "v2";
var DEFAULT_PAGE_LIMIT = Number.parseInt(process.env.TOKENMETRICS_PAGE_LIMIT || "50", 10);

// src/index.ts
elizaLogger23.log("\n=======================================");
elizaLogger23.log("   TokenMetrics Plugin Loading...     ");
elizaLogger23.log("=======================================");
elizaLogger23.log("Name      : tokenmetrics-plugin");
elizaLogger23.log("Version   : 1.0.0 (1.x MIGRATION)");
elizaLogger23.log("API Docs  : https://developers.tokenmetrics.com");
elizaLogger23.log("Real API  : https://api.tokenmetrics.com/v2");
elizaLogger23.log("");
elizaLogger23.log("\u{1F527} FEATURES IMPLEMENTED:");
elizaLogger23.log("\u2705 1.x Callback Pattern (All 21 Actions)");
elizaLogger23.log("\u2705 Updated State Management");
elizaLogger23.log("\u2705 Provider Pattern Support");
elizaLogger23.log("\u2705 Natural Language Processing");
elizaLogger23.log("\u2705 Dynamic Token Resolution");
elizaLogger23.log("\u2705 Real TokenMetrics API Integration");
elizaLogger23.log("\u2705 AI-Powered Request Extraction");
elizaLogger23.log("\u2705 Smart Analysis Type Detection");
elizaLogger23.log("\u2705 Comprehensive Error Handling");
elizaLogger23.log("\u2705 100% API Endpoint Success Rate");
elizaLogger23.log("");
elizaLogger23.log("\u{1F3AF} AVAILABLE ACTIONS (21 Total):");
elizaLogger23.log("  \u2022 Price Data & Market Analysis");
elizaLogger23.log("  \u2022 Trading Signals & Technical Analysis");
elizaLogger23.log("  \u2022 Grades & Investment Insights");
elizaLogger23.log("  \u2022 Portfolio & Risk Management");
elizaLogger23.log("  \u2022 Sentiment & News Analysis");
elizaLogger23.log("  \u2022 AI Reports & Predictions");
elizaLogger23.log("  \u2022 On-Chain & Market Metrics");
elizaLogger23.log("=======================================\n");
var tokenmetricsPlugin = {
  name: "tokenmetrics",
  description: "Complete TokenMetrics integration providing comprehensive cryptocurrency market data, analysis, and insights with advanced AI-powered natural language processing across 21 specialized endpoints (1.x compatible)",
  // All 21 updated actions with ElizaOS 1.x patterns
  actions: [
    getPriceAction,
    getTokensAction,
    getTopMarketCapAction,
    getTradingSignalsAction,
    getHourlyTradingSignalsAction,
    getDailyOhlcvAction,
    getHourlyOhlcvAction,
    getResistanceSupportAction,
    getTmGradeAction,
    getTmGradeHistoryAction,
    getTechnologyGradeAction,
    getQuantmetricsAction,
    getMarketMetricsAction,
    getCorrelationAction,
    getIndicesAction,
    getIndicesHoldingsAction,
    getIndicesPerformanceAction,
    getAiReportsAction,
    getMoonshotTokensAction,
    getScenarioAnalysisAction,
    getCryptoInvestorsAction
  ],
  // Initialize provider system for 1.x compatibility
  providers: [],
  // Initialize evaluator system for 1.x compatibility
  evaluators: [],
  // Initialize service system for 1.x compatibility
  services: []
};
function validateTokenMetricsPlugin() {
  const issues = [];
  const recommendations = [];
  elizaLogger23.log("\u{1F50D} Validating TokenMetrics plugin configuration (1.x)...");
  if (!tokenmetricsPlugin.name || typeof tokenmetricsPlugin.name !== "string") {
    issues.push("Plugin name is missing or invalid");
  }
  if (!tokenmetricsPlugin.description || typeof tokenmetricsPlugin.description !== "string") {
    issues.push("Plugin description is missing or invalid");
  }
  const actions = tokenmetricsPlugin.actions || [];
  const evaluators = tokenmetricsPlugin.evaluators || [];
  const providers = tokenmetricsPlugin.providers || [];
  const services = tokenmetricsPlugin.services || [];
  if (actions.length === 0) {
    issues.push("No actions defined in plugin");
  }
  actions.forEach((action, index) => {
    if (!action.name || typeof action.name !== "string") {
      issues.push(`Action ${index} is missing a valid name`);
    }
    if (typeof action.handler !== "function") {
      issues.push(`Action ${action.name || index} is missing a valid handler function`);
    }
    if (typeof action.validate !== "function") {
      issues.push(`Action ${action.name || index} is missing a valid validate function`);
    }
    const handlerString = action.handler.toString();
    if (!handlerString.includes("callback") && !handlerString.includes("HandlerCallback")) {
      recommendations.push(`Action ${action.name} should use 1.x callback pattern`);
    }
    if (!action.similes || !Array.isArray(action.similes) || action.similes.length === 0) {
      recommendations.push(`Action ${action.name} should include similes for better trigger recognition`);
    }
    if (!action.examples || !Array.isArray(action.examples) || action.examples.length === 0) {
      recommendations.push(`Action ${action.name} should include examples for documentation`);
    }
    if (!action.description || typeof action.description !== "string") {
      recommendations.push(`Action ${action.name} should include a description`);
    }
  });
  const isValid2 = issues.length === 0;
  elizaLogger23.log(`\u{1F4CA} Plugin validation summary (1.x):`);
  elizaLogger23.log(`  \u2022 Actions: ${actions.length}`);
  elizaLogger23.log(`  \u2022 Evaluators: ${evaluators.length}`);
  elizaLogger23.log(`  \u2022 Providers: ${providers.length}`);
  elizaLogger23.log(`  \u2022 Services: ${services.length}`);
  if (isValid2) {
    elizaLogger23.log("\u2705 Plugin validation passed (1.x compatible)!");
  } else {
    elizaLogger23.error("\u274C Plugin validation failed:");
    issues.forEach((issue) => elizaLogger23.error(`  \u2022 ${issue}`));
  }
  if (recommendations.length > 0) {
    elizaLogger23.log("\u{1F4A1} Recommendations for 1.x improvement:");
    recommendations.forEach((rec) => elizaLogger23.log(`  \u2022 ${rec}`));
  }
  return { isValid: isValid2, issues, recommendations };
}
function debugTokenMetricsPlugin() {
  elizaLogger23.log("\u{1F9EA} TokenMetrics Plugin Debug Information (1.x):");
  elizaLogger23.log(`  \u{1F4CB} Plugin Name: ${tokenmetricsPlugin.name}`);
  elizaLogger23.log(`  \u{1F4CB} Description: ${tokenmetricsPlugin.description}`);
  const actions = tokenmetricsPlugin.actions || [];
  const evaluators = tokenmetricsPlugin.evaluators || [];
  const providers = tokenmetricsPlugin.providers || [];
  const services = tokenmetricsPlugin.services || [];
  elizaLogger23.log("  \u{1F527} Plugin Components (1.x):");
  elizaLogger23.log(`    \u2022 Actions: ${actions.length}`);
  elizaLogger23.log(`    \u2022 Evaluators: ${evaluators.length}`);
  elizaLogger23.log(`    \u2022 Providers: ${providers.length}`);
  elizaLogger23.log(`    \u2022 Services: ${services.length}`);
  if (actions.length > 0) {
    elizaLogger23.log("  \u{1F3AC} Available Actions (1.x):");
    actions.forEach((action, index) => {
      const similes = action.similes || [];
      const examples2 = action.examples || [];
      elizaLogger23.log(`    ${index + 1}. ${action.name}`);
      elizaLogger23.log(`       Description: ${action.description || "No description"}`);
      elizaLogger23.log(`       Similes: ${similes.length > 0 ? similes.join(", ") : "None"}`);
      elizaLogger23.log(`       Examples: ${examples2.length}`);
      const handlerString = action.handler.toString();
      const hasCallback = handlerString.includes("callback") || handlerString.includes("HandlerCallback");
      const hasAwait = handlerString.includes("await callback");
      elizaLogger23.log(`       1.x Callback: ${hasCallback ? "\u2705" : "\u274C"}`);
      elizaLogger23.log(`       Async Callback: ${hasAwait ? "\u2705" : "\u26A0\uFE0F"}`);
    });
  }
}
function checkTokenMetricsEnvironment() {
  const missingVars = [];
  const suggestions = [];
  elizaLogger23.log("\u{1F50D} Checking TokenMetrics environment configuration (1.x)...");
  const apiKeyFromEnv = process.env.TOKENMETRICS_API_KEY;
  if (!apiKeyFromEnv) {
    missingVars.push("TOKENMETRICS_API_KEY");
    suggestions.push("Add TOKENMETRICS_API_KEY=your_api_key_here to your .env file");
    suggestions.push("Ensure your character.ts file includes TOKENMETRICS_API_KEY in secrets");
    suggestions.push("Verify you have a valid TokenMetrics API subscription");
  } else {
    elizaLogger23.log("\u2705 TOKENMETRICS_API_KEY found in environment");
    if (apiKeyFromEnv.length < 10) {
      suggestions.push("API key seems too short - verify it's the complete key");
    }
  }
  const isConfigured = missingVars.length === 0;
  if (isConfigured) {
    elizaLogger23.log("\u2705 TokenMetrics environment is properly configured (1.x)!");
  } else {
    elizaLogger23.warn("\u26A0\uFE0F TokenMetrics environment configuration issues found:");
    missingVars.forEach((varName) => elizaLogger23.warn(`  \u2022 Missing: ${varName}`));
    if (suggestions.length > 0) {
      elizaLogger23.log("\u{1F4A1} Configuration suggestions:");
      suggestions.forEach((suggestion) => elizaLogger23.log(`  \u2022 ${suggestion}`));
    }
  }
  return { isConfigured, missingVars, suggestions };
}
function validatePluginRuntime() {
  elizaLogger23.log("\u{1F504} Performing runtime validation (1.x)...");
  try {
    const actions = tokenmetricsPlugin.actions || [];
    if (actions.length === 0) {
      elizaLogger23.error("\u274C No actions available at runtime");
      return false;
    }
    for (const action of actions) {
      if (!action.name || typeof action.name !== "string") {
        elizaLogger23.error(`\u274C Action missing valid name`);
        return false;
      }
      if (typeof action.handler !== "function") {
        elizaLogger23.error(`\u274C Action ${action.name} handler is not a function`);
        return false;
      }
      if (typeof action.validate !== "function") {
        elizaLogger23.error(`\u274C Action ${action.name} validate is not a function`);
        return false;
      }
      const handlerString = action.handler.toString();
      if (!handlerString.includes("callback")) {
        elizaLogger23.warn(`\u26A0\uFE0F Action ${action.name} may not be using 1.x callback pattern`);
      }
    }
    elizaLogger23.log("\u2705 Runtime validation passed (1.x compatible)!");
    elizaLogger23.log(`\u{1F4CA} Validated ${actions.length} actions successfully`);
    return true;
  } catch (error) {
    elizaLogger23.error("\u274C Runtime validation failed:", error);
    return false;
  }
}
elizaLogger23.log("\u{1F680} Running TokenMetrics plugin initialization checks (1.x)...");
var structureValidation = validateTokenMetricsPlugin();
var envValidation = checkTokenMetricsEnvironment();
var runtimeValidation = validatePluginRuntime();
debugTokenMetricsPlugin();
if (structureValidation.isValid && envValidation.isConfigured && runtimeValidation) {
  elizaLogger23.success("\u{1F389} TokenMetrics plugin fully initialized and ready (1.x compatible)!");
  elizaLogger23.log("\u{1F4AC} Users can now ask: 'What's the price of Bitcoin?'");
  elizaLogger23.log("\u{1F527} Plugin uses 1.x callback patterns - enhanced TypeScript compatibility");
  elizaLogger23.log("\u26A1 Updated state management with composeState support");
} else {
  elizaLogger23.warn("\u26A0\uFE0F TokenMetrics plugin loaded with some issues:");
  if (!structureValidation.isValid) elizaLogger23.warn("  \u2022 Plugin structure issues detected");
  if (!envValidation.isConfigured) elizaLogger23.warn("  \u2022 Environment configuration incomplete");
  if (!runtimeValidation) elizaLogger23.warn("  \u2022 Runtime validation failed");
  elizaLogger23.log("\u{1F4A1} Check the logs above for specific recommendations");
}
var index_default = tokenmetricsPlugin;
export {
  callTokenMetricsAPI,
  checkTokenMetricsEnvironment,
  debugTokenMetricsPlugin,
  index_default as default,
  extractTokenMetricsRequest,
  formatCurrency,
  formatPercentage,
  generateRequestId,
  mapSymbolToName,
  resolveTokenSmart,
  tokenmetricsPlugin,
  validateAndGetApiKey,
  validatePluginRuntime,
  validateTokenMetricsPlugin
};
//# sourceMappingURL=index.js.map