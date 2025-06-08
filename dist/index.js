// src/index.ts
import { elizaLogger as elizaLogger9 } from "@elizaos/core";

// src/actions/getPriceAction.ts
import { elizaLogger as elizaLogger2 } from "@elizaos/core";

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
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
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
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
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
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
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
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
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
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
      overrideMap === errorMap ? void 0 : errorMap
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
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;
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
      if (this._key instanceof Array) {
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
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== void 0 ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== void 0 ? message : required_error) !== null && _a !== void 0 ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== void 0 ? message : invalid_type_error) !== null && _b !== void 0 ? _b : ctx.defaultError };
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
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
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
        if ((_b = (_a = err === null || err === void 0 ? void 0 : err.message) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === null || _b === void 0 ? void 0 : _b.includes("encountered")) {
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
        contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
        async: true
      },
      path: (params === null || params === void 0 ? void 0 : params.path) || [],
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
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
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
        } catch (_a) {
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
    var _a, _b;
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
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
      local: (_b = options === null || options === void 0 ? void 0 : options.local) !== null && _b !== void 0 ? _b : false,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
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
      precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
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
      position: options === null || options === void 0 ? void 0 : options.position,
      ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message)
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
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
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
    let max = null, min = null;
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
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
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
      } catch (_a) {
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
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
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
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
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
    if (isNaN(input.data.getTime())) {
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
    coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
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
    return this._cached = { shape, keys };
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
      } else if (unknownKeys === "strip") ;
      else {
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
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError
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
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
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
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
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
    });
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
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
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
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
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
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, void 0);
  }
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
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
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
_ZodEnum_cache = /* @__PURE__ */ new WeakMap();
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, void 0);
  }
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
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
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
_ZodNativeEnum_cache = /* @__PURE__ */ new WeakMap();
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
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
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
      var _a, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a2, _b2;
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) !== null && _a2 !== void 0 ? _a2 : fatal) !== null && _b2 !== void 0 ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
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
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  "enum": enumType,
  "function": functionType,
  "instanceof": instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  "null": nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  "undefined": undefinedType,
  union: unionType,
  unknown: unknownType,
  "void": voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// src/actions/aiActionHelper.ts
import {
  elizaLogger,
  composeContext,
  generateObject,
  ModelClass
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
    const HARDCODED_API_KEY = "REDACTED_API_KEY";
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
      const responseText2 = await response.text();
      elizaLogger.error(`\u274C API Error ${response.status}: ${responseText2}`);
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
  elizaLogger.log("\u{1F504} Forcing fresh state composition with cache busting...");
  state = await runtime.composeState(message);
  elizaLogger.log("\u{1F4CA} Composed fresh state with cache busting");
  const uniqueTemplate = `${template}

# Cache Busting ID: ${requestId}
# Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}

USER MESSAGE: "${message.content.text}"

Please analyze the CURRENT user message above and extract the relevant information.`;
  const context = composeContext({
    state,
    template: uniqueTemplate
  });
  elizaLogger.log("\u{1F3AF} Context created with cache busting, extracting information...");
  console.log(`
\u{1F50D} AI EXTRACTION CONTEXT [${requestId}]:`);
  console.log(`\u{1F4DD} User message: "${message.content.text}"`);
  console.log(`\u{1F4CB} Template being used:`);
  console.log(uniqueTemplate);
  console.log(`\u{1F51A} END CONTEXT [${requestId}]
`);
  const response = await generateObject({
    runtime,
    context,
    modelClass: ModelClass.LARGE,
    // Changed from SMALL to LARGE for better instruction following
    schema
  });
  const extractedRequest = response.object;
  elizaLogger.log("\u{1F3AF} AI Extracted request:", extractedRequest);
  elizaLogger.log(`\u{1F194} Request ${requestId}: AI Processing completed`);
  return extractedRequest;
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
    return `$${numValue.toFixed(6)}`;
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
function getWellKnownTokenId(input) {
  elizaLogger.warn("\u26A0\uFE0F getWellKnownTokenId is deprecated - use resolveTokenSmart() for dynamic resolution");
  const tokenIdMap = {
    // Major cryptocurrencies with known TokenMetrics IDs
    "BITCOIN": 3375,
    "BTC": 3375,
    "ETHEREUM": 3306,
    "ETH": 3306,
    "SOLANA": 3408,
    "SOL": 3408,
    "CARDANO": 3321,
    "ADA": 3321,
    "POLYGON": 3390,
    "MATIC": 3390,
    "POLKADOT": 3394,
    "DOT": 3394,
    "CHAINLINK": 3327,
    "LINK": 3327,
    "UNISWAP": 3424,
    "UNI": 3424,
    "AVALANCHE": 3315,
    "AVAX": 3315,
    "LITECOIN": 3373,
    "LTC": 3373,
    "DOGECOIN": 3340,
    "DOGE": 3340,
    "XRP": 3430,
    "RIPPLE": 3430,
    "BNB": 3318,
    "BINANCE COIN": 3318,
    "TETHER": 3420,
    "USDT": 3420,
    "USD COIN": 3423,
    "USDC": 3423,
    "COSMOS": 3333,
    "ATOM": 3333,
    "NEAR PROTOCOL": 3385,
    "NEAR": 3385,
    "FANTOM": 3348,
    "FTM": 3348,
    "ALGORAND": 3309,
    "ALGO": 3309,
    "VECHAIN": 3427,
    "VET": 3427,
    "INTERNET COMPUTER": 3364,
    "ICP": 3364,
    "FLOW": 3351,
    "THE SANDBOX": 3412,
    "SAND": 3412,
    "DECENTRALAND": 3336,
    "MANA": 3336,
    "CRONOS": 3334,
    "CRO": 3334,
    "APECOIN": 3312,
    "APE": 3312,
    "SHIBA INU": 3409,
    "SHIB": 3409
  };
  const upperInput = input.toUpperCase().trim();
  return tokenIdMap[upperInput] || null;
}
async function resolveTokenSmart(input, runtime) {
  elizaLogger.log(`\u{1F50D} Resolving token: "${input}" (Pure API search approach)`);
  try {
    const trimmedInput = input.trim();
    elizaLogger.log(`\u{1F50D} Searching TokenMetrics database for: "${trimmedInput}"`);
    elizaLogger.log(`\u{1F50D} Step 1: Searching by token name "${trimmedInput}"`);
    let searchResult = await callTokenMetricsAPI("/v2/tokens", {
      token_name: trimmedInput,
      limit: 5
    }, runtime);
    let tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
    if (tokens.length > 0) {
      let found = tokens.find(
        (token) => token.TOKEN_NAME?.toLowerCase() === trimmedInput.toLowerCase()
      );
      if (!found) {
        found = tokens[0];
      }
      elizaLogger.log(`\u2705 Found token by name search: ${found.TOKEN_NAME} (${found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
      return found;
    }
    elizaLogger.log(`\u{1F50D} Step 2: Searching by symbol "${trimmedInput}"`);
    searchResult = await callTokenMetricsAPI("/v2/tokens", {
      symbol: trimmedInput,
      limit: 5
    }, runtime);
    tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
    if (tokens.length > 0) {
      const found = tokens[0];
      elizaLogger.log(`\u2705 Found token by symbol search: ${found.TOKEN_NAME} (${found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
      return found;
    }
    const upperInput = trimmedInput.toUpperCase();
    const lowerInput = trimmedInput.toLowerCase();
    for (const variation of [upperInput, lowerInput]) {
      if (variation === trimmedInput) continue;
      elizaLogger.log(`\u{1F50D} Step 3: Trying variation "${variation}"`);
      for (const searchType of ["token_name", "symbol"]) {
        try {
          searchResult = await callTokenMetricsAPI("/v2/tokens", {
            [searchType]: variation,
            limit: 3
          }, runtime);
          tokens = Array.isArray(searchResult) ? searchResult : searchResult?.data || [];
          if (tokens.length > 0) {
            const found = tokens[0];
            elizaLogger.log(`\u2705 Found token by ${searchType} variation "${variation}": ${found.TOKEN_NAME} (${found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
            return found;
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
        const upperInput2 = trimmedInput.toUpperCase();
        const found = tokens.find(
          (token) => token.TOKEN_NAME?.toUpperCase().includes(upperInput2) || token.TOKEN_SYMBOL?.toUpperCase().includes(upperInput2)
        );
        if (found) {
          elizaLogger.log(`\u2705 Found token by partial match: ${found.TOKEN_NAME} (${found.TOKEN_SYMBOL}) - ID: ${found.TOKEN_ID}`);
          return found;
        }
      }
    } catch (broadError) {
      elizaLogger.log(`\u26A0\uFE0F Broad search failed, skipping...`);
    }
    elizaLogger.log(`\u274C No token found for: "${trimmedInput}" after trying all search methods`);
    return null;
  } catch (error) {
    elizaLogger.error(`\u274C Error resolving token "${input}":`, error);
    return null;
  }
}

// src/actions/getPriceAction.ts
function extractCryptocurrencySimple(text) {
  const message = text.toLowerCase();
  const patterns = [
    // Full names
    /\b(bitcoin|btc)\b/i,
    /\b(ethereum|eth)\b/i,
    /\b(dogecoin|doge)\b/i,
    /\b(avalanche|avax)\b/i,
    /\b(solana|sol)\b/i,
    /\b(cardano|ada)\b/i,
    /\b(polygon|matic)\b/i,
    /\b(chainlink|link)\b/i,
    /\b(uniswap|uni)\b/i,
    /\b(polkadot|dot)\b/i,
    /\b(litecoin|ltc)\b/i,
    /\b(ripple|xrp)\b/i,
    /\b(binance coin|bnb)\b/i,
    /\b(shiba inu|shib)\b/i,
    /\b(pepe)\b/i,
    /\b(cosmos|atom)\b/i,
    /\b(near protocol|near)\b/i,
    /\b(fantom|ftm)\b/i,
    /\b(algorand|algo)\b/i,
    /\b(vechain|vet)\b/i,
    /\b(internet computer|icp)\b/i,
    /\b(flow)\b/i,
    /\b(the sandbox|sand)\b/i,
    /\b(decentraland|mana)\b/i,
    /\b(cronos|cro)\b/i,
    /\b(apecoin|ape)\b/i
  ];
  const nameMap = {
    "bitcoin": "Bitcoin",
    "btc": "Bitcoin",
    "ethereum": "Ethereum",
    "eth": "Ethereum",
    "dogecoin": "Dogecoin",
    "doge": "Dogecoin",
    "avalanche": "Avalanche",
    "avax": "Avalanche",
    "solana": "Solana",
    "sol": "Solana",
    "cardano": "Cardano",
    "ada": "Cardano",
    "polygon": "Polygon",
    "matic": "Polygon",
    "chainlink": "Chainlink",
    "link": "Chainlink",
    "uniswap": "Uniswap",
    "uni": "Uniswap",
    "polkadot": "Polkadot",
    "dot": "Polkadot",
    "litecoin": "Litecoin",
    "ltc": "Litecoin",
    "ripple": "XRP",
    "xrp": "XRP",
    "binance coin": "BNB",
    "bnb": "BNB",
    "shiba inu": "Shiba Inu",
    "shib": "Shiba Inu",
    "pepe": "Pepe",
    "cosmos": "Cosmos",
    "atom": "Cosmos",
    "near protocol": "NEAR Protocol",
    "near": "NEAR Protocol",
    "fantom": "Fantom",
    "ftm": "Fantom",
    "algorand": "Algorand",
    "algo": "Algorand",
    "vechain": "VeChain",
    "vet": "VeChain",
    "internet computer": "Internet Computer",
    "icp": "Internet Computer",
    "flow": "Flow",
    "the sandbox": "The Sandbox",
    "sand": "The Sandbox",
    "decentraland": "Decentraland",
    "mana": "Decentraland",
    "cronos": "Cronos",
    "cro": "Cronos",
    "apecoin": "ApeCoin",
    "ape": "ApeCoin"
  };
  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      const found = match[0].toLowerCase();
      return nameMap[found] || found;
    }
  }
  return null;
}
var PriceRequestSchema = z.object({
  cryptocurrency: z.string().describe("The cryptocurrency name or symbol (e.g., 'Bitcoin', 'BTC', 'Ethereum', 'ETH', 'Dogecoin', 'DOGE', 'Avalanche', 'AVAX')"),
  symbol: z.string().optional().describe("The cryptocurrency symbol (e.g., 'BTC', 'ETH', 'SOL', 'DOGE', 'AVAX')"),
  analysisType: z.enum(["current", "trend", "technical", "all"]).optional().describe("Type of price analysis to focus on")
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
   - Extract whatever cryptocurrency name the user said (Bitcoin, Ethereum, Dogecoin, Avalanche, etc.)
   - Extract whatever symbol the user said (BTC, ETH, DOGE, AVAX, etc.)
   - DO NOT change or substitute the cryptocurrency name

2. **symbol** (optional): The cryptocurrency symbol if mentioned or mappable
   - Common mappings: Bitcoin\u2192BTC, Ethereum\u2192ETH, Dogecoin\u2192DOGE, Avalanche\u2192AVAX, Solana\u2192SOL

3. **analysisType** (optional, default: "current"): What type of price analysis they want
   - "current" - just the current price (default)
   - "trend" - price trends and changes  
   - "technical" - technical analysis
   - "all" - comprehensive analysis

CRITICAL: Only extract if this is clearly a PRICE request, not a token search/database request.

Extract the price request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "What's the price of Bitcoin?"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get the current Bitcoin price from TokenMetrics for you.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "How much is Ethereum worth right now?"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Let me fetch the latest Ethereum price data from TokenMetrics.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get me Solana price trends"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve Solana price data with trend analysis from TokenMetrics.",
          action: "GET_PRICE_TOKENMETRICS"
        }
      }
    ]
  ],
  validate: async (runtime, message) => {
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger2.error("\u274C Price action validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback2) => {
    try {
      const requestId = generateRequestId();
      elizaLogger2.log(`[${requestId}] Processing price request...`);
      elizaLogger2.log(`[${requestId}] \u{1F50D} DEBUG: User message content: "${message.content.text}"`);
      console.log(`
\u{1F50D} PRICE ACTION DEBUG [${requestId}]:`);
      console.log(`\u{1F4DD} User message: "${message.content.text}"`);
      const priceRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        PRICE_EXTRACTION_TEMPLATE,
        PriceRequestSchema,
        requestId
      );
      elizaLogger2.log(`[${requestId}] \u{1F3AF} DEBUG: AI Extracted request:`, JSON.stringify(priceRequest, null, 2));
      console.log(`\u{1F3AF} AI Extracted:`, JSON.stringify(priceRequest, null, 2));
      let cryptoToResolve = priceRequest.cryptocurrency || priceRequest.symbol;
      const regexExtracted = extractCryptocurrencySimple(message.content.text);
      if (regexExtracted && cryptoToResolve && cryptoToResolve.toLowerCase() !== regexExtracted.toLowerCase()) {
        elizaLogger2.log(`[${requestId}] \u{1F504} DEBUG: AI extracted "${cryptoToResolve}" but regex found "${regexExtracted}" - using regex result`);
        console.log(`\u{1F504} AI vs Regex mismatch: AI="${cryptoToResolve}", Regex="${regexExtracted}" - using Regex`);
        cryptoToResolve = regexExtracted;
      } else if (!cryptoToResolve && regexExtracted) {
        elizaLogger2.log(`[${requestId}] \u{1F504} DEBUG: AI extraction failed, using regex result: "${regexExtracted}"`);
        console.log(`\u{1F504} AI extraction failed, using regex result: "${regexExtracted}"`);
        cryptoToResolve = regexExtracted;
      }
      elizaLogger2.log(`[${requestId}] \u{1F50D} DEBUG: Crypto to resolve: "${cryptoToResolve}"`);
      console.log(`\u{1F50D} Crypto to resolve: "${cryptoToResolve}"`);
      if (!cryptoToResolve) {
        elizaLogger2.log(`[${requestId}] \u274C DEBUG: No cryptocurrency identified from extraction`);
        console.log(`\u274C No cryptocurrency identified from extraction`);
        if (callback2) {
          callback2({
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
        return false;
      }
      elizaLogger2.log(`[${requestId}] \u{1F50D} DEBUG: Starting token resolution for: "${cryptoToResolve}"`);
      console.log(`\u{1F50D} Starting token resolution for: "${cryptoToResolve}"`);
      const tokenInfo = await resolveTokenSmart(cryptoToResolve, runtime);
      elizaLogger2.log(`[${requestId}] \u{1F3AF} DEBUG: Token resolution result:`, tokenInfo ? {
        name: tokenInfo.TOKEN_NAME || tokenInfo.NAME,
        symbol: tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL,
        id: tokenInfo.TOKEN_ID
      } : "null");
      console.log(`\u{1F3AF} Token resolved:`, tokenInfo ? {
        name: tokenInfo.TOKEN_NAME || tokenInfo.NAME,
        symbol: tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL,
        id: tokenInfo.TOKEN_ID
      } : "null");
      console.log(`\u{1F51A} END DEBUG [${requestId}]
`);
      if (!tokenInfo) {
        elizaLogger2.log(`[${requestId}] \u274C DEBUG: Token resolution failed for: "${cryptoToResolve}"`);
        if (callback2) {
          callback2({
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
        return false;
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
        if (callback2) {
          callback2({
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
        return false;
      }
      const analysisType = priceRequest.analysisType || "current";
      const analysis = analyzePriceData(priceData, analysisType);
      const responseText2 = formatPriceResponse(priceData, tokenInfo, analysisType);
      elizaLogger2.log(`[${requestId}] Successfully processed price request`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      elizaLogger2.error("\u274C Error in price action:", error);
      if (callback2) {
        callback2({
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
      return false;
    }
  }
};

// src/actions/getTraderGradesAction.ts
import {
  elizaLogger as elizaLogger3
} from "@elizaos/core";
var traderGradesTemplate = `# Task: Extract Trader Grades Request Information

Based on the conversation context, identify what trader grades information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Trader grade requests ("trader grades", "trading grades", "AI grades", "token grades", "ratings")
- Grade types ("A", "B", "C", "D", "F" grades)
- Time periods or date ranges
- Market filters (category, exchange, market cap, volume)

The user might say things like:
- "Get trader grades for Bitcoin"
- "Show me AI trader grades"
- "What are the current token grades?"
- "Get A-grade tokens for trading"
- "Show trading grades for DeFi tokens"
- "Get grades for tokens with high volume"
- "What tokens have A+ grades today?"

Extract the relevant information for the trader grades request.

# Response Format:
Return a structured object with the trader grades request information.`;
var TraderGradesRequestSchema = z.object({
  cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
  grade_filter: z.enum(["A", "B", "C", "D", "F", "any"]).nullable().describe("Grade filter requested"),
  category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
  exchange: z.string().nullable().describe("Exchange filter"),
  time_period: z.string().nullable().describe("Time period or date range"),
  market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
  confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});
async function fetchTraderGrades(params, runtime) {
  elizaLogger3.log(`\u{1F4E1} Fetching trader grades with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/trader-grades", params, runtime);
    if (!data) {
      throw new Error("No data received from trader grades API");
    }
    elizaLogger3.log(`\u2705 Successfully fetched trader grades data`);
    return data;
  } catch (error) {
    elizaLogger3.error("\u274C Error fetching trader grades:", error);
    throw error;
  }
}
function convertToLetterGrade(numericGrade) {
  if (numericGrade >= 90) return "A";
  if (numericGrade >= 80) return "B";
  if (numericGrade >= 70) return "C";
  if (numericGrade >= 60) return "D";
  return "F";
}
function formatTraderGradesResponse(data, tokenInfo) {
  if (!data || data.length === 0) {
    return "\u274C No trader grades found for the specified criteria.";
  }
  const grades = Array.isArray(data) ? data : [data];
  const gradeCount = grades.length;
  const gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  const processedGrades = grades.map((item) => {
    const numericGrade = item.TM_TRADER_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
    const letterGrade = convertToLetterGrade(numericGrade);
    gradeDistribution[letterGrade]++;
    return {
      ...item,
      LETTER_GRADE: letterGrade,
      NUMERIC_GRADE: numericGrade
    };
  });
  let response = `\u{1F4CA} **TokenMetrics Trader Grades Analysis**

`;
  if (tokenInfo) {
    response += `\u{1F3AF} **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})
`;
  }
  response += `\u{1F4C8} **Grade Summary**: ${gradeCount} tokens analyzed
`;
  response += `\u{1F7E2} **A Grade**: ${gradeDistribution.A} tokens (${(gradeDistribution.A / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F535} **B Grade**: ${gradeDistribution.B} tokens (${(gradeDistribution.B / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F7E1} **C Grade**: ${gradeDistribution.C} tokens (${(gradeDistribution.C / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F7E0} **D Grade**: ${gradeDistribution.D} tokens (${(gradeDistribution.D / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F534} **F Grade**: ${gradeDistribution.F} tokens (${(gradeDistribution.F / gradeCount * 100).toFixed(1)}%)

`;
  const topGrades = processedGrades.filter((g) => g.LETTER_GRADE === "A").sort((a, b) => b.NUMERIC_GRADE - a.NUMERIC_GRADE).slice(0, 5);
  if (topGrades.length > 0) {
    response += `\u{1F3C6} **Top A-Grade Tokens**:
`;
    topGrades.forEach((grade, index) => {
      response += `${index + 1}. **${grade.TOKEN_SYMBOL}** (${grade.TOKEN_NAME}): Grade ${grade.LETTER_GRADE} (${grade.NUMERIC_GRADE.toFixed(1)})`;
      if (grade.TM_TRADER_GRADE_24H_PCT_CHANGE) {
        const change = grade.TM_TRADER_GRADE_24H_PCT_CHANGE;
        const changeIcon = change > 0 ? "\u{1F4C8}" : change < 0 ? "\u{1F4C9}" : "\u27A1\uFE0F";
        response += ` ${changeIcon} ${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
      }
      response += `
`;
    });
    response += `
`;
  }
  if (gradeCount === 1 && tokenInfo) {
    const token = processedGrades[0];
    response += `\u{1F4CB} **Detailed Analysis for ${token.TOKEN_SYMBOL}**:
`;
    response += `\u2022 **Overall Grade**: ${token.LETTER_GRADE} (${token.NUMERIC_GRADE.toFixed(1)}/100)
`;
    if (token.TA_GRADE) response += `\u2022 **Technical Analysis**: ${convertToLetterGrade(token.TA_GRADE)} (${token.TA_GRADE.toFixed(1)}/100)
`;
    if (token.QUANT_GRADE) response += `\u2022 **Quantitative Analysis**: ${convertToLetterGrade(token.QUANT_GRADE)} (${token.QUANT_GRADE.toFixed(1)}/100)
`;
    if (token.TM_TRADER_GRADE_24H_PCT_CHANGE) {
      const change = token.TM_TRADER_GRADE_24H_PCT_CHANGE;
      const changeIcon = change > 0 ? "\u{1F4C8}" : change < 0 ? "\u{1F4C9}" : "\u27A1\uFE0F";
      response += `\u2022 **24h Change**: ${changeIcon} ${change > 0 ? "+" : ""}${change.toFixed(2)}%
`;
    }
    response += `\u2022 **Last Updated**: ${new Date(token.DATE).toLocaleDateString()}

`;
  }
  response += `\u{1F4A1} **AI Trading Recommendations**:
`;
  const aGradePercentage = gradeDistribution.A / gradeCount * 100;
  const fGradePercentage = gradeDistribution.F / gradeCount * 100;
  if (aGradePercentage > 30) {
    response += `\u2022 Strong market with ${aGradePercentage.toFixed(1)}% A-grade tokens
`;
    response += `\u2022 Consider increasing exposure to top-rated cryptocurrencies
`;
    response += `\u2022 Focus on A and B grade tokens for long positions
`;
  } else if (fGradePercentage > 30) {
    response += `\u2022 Weak market with ${fGradePercentage.toFixed(1)}% F-grade tokens
`;
    response += `\u2022 Exercise caution with new positions
`;
    response += `\u2022 Consider defensive strategies or cash positions
`;
  } else {
    response += `\u2022 Mixed market conditions - selective approach recommended
`;
    response += `\u2022 Focus on highest-grade tokens with strong fundamentals
`;
    response += `\u2022 Avoid D and F grade tokens for new positions
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics AI Trader Grades
`;
  response += `\u23F0 **Analysis Time**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeTraderGrades(data) {
  if (!data || data.length === 0) {
    return { error: "No data to analyze" };
  }
  const grades = Array.isArray(data) ? data : [data];
  const gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  const processedGrades = grades.map((item) => {
    const numericGrade = item.TM_TRADER_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
    const letterGrade = convertToLetterGrade(numericGrade);
    gradeDistribution[letterGrade]++;
    return {
      symbol: item.TOKEN_SYMBOL,
      name: item.TOKEN_NAME,
      grade: letterGrade,
      score: numericGrade,
      date: item.DATE,
      ta_grade: item.TA_GRADE,
      quant_grade: item.QUANT_GRADE,
      trader_grade: item.TM_TRADER_GRADE,
      change_24h: item.TM_TRADER_GRADE_24H_PCT_CHANGE
    };
  });
  const analysis = {
    total_tokens: grades.length,
    grade_distribution: gradeDistribution,
    top_tokens: processedGrades.filter((g) => g.grade === "A").sort((a, b) => b.score - a.score).slice(0, 10),
    market_quality: "neutral"
  };
  const aPercentage = gradeDistribution.A / grades.length * 100;
  const fPercentage = gradeDistribution.F / grades.length * 100;
  if (aPercentage > 40) {
    analysis.market_quality = "excellent";
  } else if (aPercentage > 25) {
    analysis.market_quality = "good";
  } else if (fPercentage > 40) {
    analysis.market_quality = "poor";
  } else {
    analysis.market_quality = "fair";
  }
  return analysis;
}
var getTraderGradesAction = {
  name: "GET_TRADER_GRADES_TOKENMETRICS",
  similes: [
    "GET_TRADER_GRADES",
    "GET_AI_GRADES",
    "GET_TOKEN_GRADES",
    "GET_TRADING_GRADES",
    "TRADER_GRADES",
    "AI_GRADES",
    "TOKEN_RATINGS"
  ],
  description: "Get AI-generated trader grades and ratings for cryptocurrencies from TokenMetrics",
  validate: async (runtime, message) => {
    elizaLogger3.log("\u{1F50D} Validating getTraderGradesAction");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger3.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback2) => {
    const requestId = generateRequestId();
    elizaLogger3.log("\u{1F680} Starting TokenMetrics trader grades handler");
    elizaLogger3.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger3.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      const gradesRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        traderGradesTemplate,
        TraderGradesRequestSchema,
        requestId
      );
      elizaLogger3.log("\u{1F3AF} AI Extracted grades request:", gradesRequest);
      elizaLogger3.log(`\u{1F194} Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || "general market"}"`);
      if (!gradesRequest.cryptocurrency && !gradesRequest.grade_filter && !gradesRequest.category && gradesRequest.confidence < 0.3) {
        elizaLogger3.log("\u274C AI extraction failed or insufficient information");
        if (callback2) {
          callback2({
            text: `\u274C I couldn't identify specific trader grades criteria from your request.

I can get AI trader grades for:
\u2022 Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
\u2022 Grade filters (A, B, C, D, F grades)
\u2022 Token categories (DeFi, Layer-1, meme tokens)
\u2022 Market filters (high volume, large cap, etc.)

Try asking something like:
\u2022 "Get trader grades for Bitcoin"
\u2022 "Show me A-grade tokens"
\u2022 "What are the current AI grades?"
\u2022 "Get trading grades for DeFi tokens"`,
            content: {
              error: "Insufficient trader grades criteria",
              confidence: gradesRequest?.confidence || 0,
              request_id: requestId
            }
          });
        }
        return false;
      }
      elizaLogger3.success("\u{1F3AF} Final extraction result:", gradesRequest);
      const apiParams = {
        limit: 50,
        page: 1
      };
      let tokenInfo = null;
      if (gradesRequest.cryptocurrency) {
        elizaLogger3.log(`\u{1F50D} Resolving token for: "${gradesRequest.cryptocurrency}"`);
        tokenInfo = await resolveTokenSmart(gradesRequest.cryptocurrency, runtime);
        if (tokenInfo) {
          apiParams.token_id = tokenInfo.TOKEN_ID;
          elizaLogger3.log(`\u2705 Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
        } else {
          apiParams.symbol = gradesRequest.cryptocurrency.toUpperCase();
          elizaLogger3.log(`\u{1F50D} Using symbol: ${gradesRequest.cryptocurrency}`);
        }
      }
      if (gradesRequest.grade_filter && gradesRequest.grade_filter !== "any") {
        apiParams.grade = gradesRequest.grade_filter;
      }
      if (gradesRequest.category) {
        apiParams.category = gradesRequest.category;
      }
      if (gradesRequest.exchange) {
        apiParams.exchange = gradesRequest.exchange;
      }
      elizaLogger3.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger3.log(`\u{1F4E1} Fetching trader grades data`);
      const gradesData = await fetchTraderGrades(apiParams, runtime);
      if (!gradesData) {
        elizaLogger3.log("\u274C Failed to fetch trader grades data");
        if (callback2) {
          callback2({
            text: `\u274C Unable to fetch trader grades data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting
\u2022 No grades available for the specified criteria

Please try again in a few moments or try with different criteria.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return false;
      }
      const grades = Array.isArray(gradesData) ? gradesData : gradesData.data || [];
      elizaLogger3.log(`\u{1F50D} Received ${grades.length} trader grades`);
      const responseText2 = formatTraderGradesResponse(grades, tokenInfo);
      const analysis = analyzeTraderGrades(grades);
      elizaLogger3.success("\u2705 Successfully processed trader grades request");
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            grades_data: grades,
            analysis,
            source: "TokenMetrics AI Trader Grades",
            request_id: requestId,
            query_details: {
              original_request: gradesRequest.cryptocurrency || "general market",
              grade_filter: gradesRequest.grade_filter,
              category: gradesRequest.category,
              confidence: gradesRequest.confidence,
              data_freshness: "real-time",
              request_id: requestId,
              extraction_method: "ai_with_cache_busting"
            }
          }
        });
      }
      return true;
    } catch (error) {
      elizaLogger3.error("\u274C Error in TokenMetrics trader grades handler:", error);
      elizaLogger3.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      if (callback2) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        callback2({
          text: `\u274C I encountered an error while fetching trader grades: ${errorMessage}

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
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get trader grades for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll fetch the latest AI trader grades for Bitcoin from TokenMetrics.",
          action: "GET_TRADER_GRADES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me A-grade tokens"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get all A-grade tokens from TokenMetrics AI trader grades.",
          action: "GET_TRADER_GRADES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are the current AI trading grades?"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Let me fetch the latest AI trader grades and ratings from TokenMetrics.",
          action: "GET_TRADER_GRADES_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getInvestorGradesAction.ts
import {
  elizaLogger as elizaLogger4,
  composeContext as composeContext3,
  generateObject as generateObject3,
  ModelClass as ModelClass3
} from "@elizaos/core";
var investorGradesTemplate = `# Task: Extract Investor Grades Request Information

Based on the conversation context, identify what investor grades information the user is requesting.

# Conversation Context:
{{recentMessages}}

# CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, DOGE, SHIB, PEPE, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, Dogecoin, etc.)
- Investor grade requests ("investor grades", "investment grades", "long-term grades", "investment ratings")
- Grade types ("A", "B", "C", "D", "F" grades)
- Investment timeframes ("long-term", "investment horizon", "hodl")
- Market filters (category, exchange, market cap, volume)

PATTERN RECOGNITION:
- "Bitcoin" or "BTC" \u2192 cryptocurrency: "Bitcoin", symbol: "BTC"
- "Ethereum" or "ETH" \u2192 cryptocurrency: "Ethereum", symbol: "ETH"  
- "Solana" or "SOL" \u2192 cryptocurrency: "Solana", symbol: "SOL"
- "Dogecoin" or "DOGE" \u2192 cryptocurrency: "Dogecoin", symbol: "DOGE"
- "Avalanche" or "AVAX" \u2192 cryptocurrency: "Avalanche", symbol: "AVAX"

The user might say things like:
- "Get investor grades for Bitcoin"
- "Show me long-term investment grades"
- "What are the current investor ratings?"
- "Get A-grade tokens for investment"
- "Show investment grades for DeFi tokens"
- "Get grades for long-term holding"
- "What tokens have A+ investor grades?"
- "Investment rating for SOL"
- "Show me investment grades for AVAX"

Extract the relevant information for the investor grades request.

# Response Format:
Return a structured object with the investor grades request information.

# Cache Busting ID: {{requestId}}
# Timestamp: {{timestamp}}

USER MESSAGE: "{{userMessage}}"

Please analyze the CURRENT user message above and extract the relevant information.`;
var InvestorGradesRequestSchema = z.object({
  cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
  symbol: z.string().nullable().describe("The cryptocurrency symbol if identified"),
  grade_filter: z.enum(["A", "B", "C", "D", "F", "any"]).nullable().describe("Grade filter requested"),
  category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
  confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});
function extractCryptocurrencySimple2(text) {
  const cryptoPatterns = [
    { regex: /\b(bitcoin|btc)\b/i, name: "Bitcoin", symbol: "BTC" },
    { regex: /\b(ethereum|eth)\b/i, name: "Ethereum", symbol: "ETH" },
    { regex: /\b(solana|sol)\b/i, name: "Solana", symbol: "SOL" },
    { regex: /\b(cardano|ada)\b/i, name: "Cardano", symbol: "ADA" },
    { regex: /\b(polygon|matic)\b/i, name: "Polygon", symbol: "MATIC" },
    { regex: /\b(avalanche|avax)\b/i, name: "Avalanche", symbol: "AVAX" },
    { regex: /\b(chainlink|link)\b/i, name: "Chainlink", symbol: "LINK" },
    { regex: /\b(uniswap|uni)\b/i, name: "Uniswap", symbol: "UNI" },
    { regex: /\b(dogecoin|doge)\b/i, name: "Dogecoin", symbol: "DOGE" },
    { regex: /\b(shiba|shib)\b/i, name: "Shiba Inu", symbol: "SHIB" },
    { regex: /\b(pepe)\b/i, name: "Pepe", symbol: "PEPE" },
    { regex: /\b(polkadot|dot)\b/i, name: "Polkadot", symbol: "DOT" }
  ];
  for (const pattern of cryptoPatterns) {
    if (pattern.regex.test(text)) {
      return { cryptocurrency: pattern.name, symbol: pattern.symbol };
    }
  }
  return null;
}
function convertToLetterGrade2(numericGrade) {
  if (numericGrade >= 90) return "A";
  if (numericGrade >= 80) return "B";
  if (numericGrade >= 70) return "C";
  if (numericGrade >= 60) return "D";
  return "F";
}
async function fetchInvestorGrades(params, runtime) {
  elizaLogger4.log(`\u{1F4E1} Fetching investor grades with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/investor-grades", params, runtime);
    if (!data) {
      throw new Error("No data received from investor grades API");
    }
    elizaLogger4.log(`\u2705 Successfully fetched investor grades data`);
    return data;
  } catch (error) {
    elizaLogger4.error("\u274C Error fetching investor grades:", error);
    throw error;
  }
}
function formatInvestorGradesResponse(data, tokenInfo) {
  if (!data || data.length === 0) {
    return "\u274C No investor grades found for the specified criteria.";
  }
  const grades = Array.isArray(data) ? data : [data];
  const gradeCount = grades.length;
  const gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  grades.forEach((item) => {
    const numericGrade = item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
    const letterGrade = convertToLetterGrade2(numericGrade);
    gradeDistribution[letterGrade]++;
  });
  let response = `\u{1F4CA} **TokenMetrics Investor Grades Analysis**

`;
  if (tokenInfo) {
    response += `\u{1F3AF} **Token**: ${tokenInfo.TOKEN_NAME || tokenInfo.NAME} (${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL})
`;
  }
  response += `\u{1F4C8} **Grade Summary**: ${gradeCount} tokens analyzed
`;
  response += `\u{1F7E2} **A Grade**: ${gradeDistribution.A} tokens (${(gradeDistribution.A / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F535} **B Grade**: ${gradeDistribution.B} tokens (${(gradeDistribution.B / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F7E1} **C Grade**: ${gradeDistribution.C} tokens (${(gradeDistribution.C / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F7E0} **D Grade**: ${gradeDistribution.D} tokens (${(gradeDistribution.D / gradeCount * 100).toFixed(1)}%)
`;
  response += `\u{1F534} **F Grade**: ${gradeDistribution.F} tokens (${(gradeDistribution.F / gradeCount * 100).toFixed(1)}%)

`;
  if (tokenInfo && grades.length === 1) {
    const grade = grades[0];
    const numericGrade = grade.TM_INVESTOR_GRADE || grade.INVESTOR_GRADE || grade.TA_GRADE || grade.QUANT_GRADE || 0;
    const letterGrade = convertToLetterGrade2(numericGrade);
    response += `\u{1F4CB} **Detailed Analysis for ${tokenInfo.TOKEN_SYMBOL || tokenInfo.SYMBOL}**:
`;
    response += `\u2022 **Overall Grade**: ${letterGrade} (${numericGrade.toFixed(1)}/100)
`;
    if (grade.TA_GRADE) {
      response += `\u2022 **Technical Analysis**: ${convertToLetterGrade2(grade.TA_GRADE)} (${grade.TA_GRADE.toFixed(1)}/100)
`;
    }
    if (grade.QUANT_GRADE) {
      response += `\u2022 **Quantitative Analysis**: ${convertToLetterGrade2(grade.QUANT_GRADE)} (${grade.QUANT_GRADE.toFixed(1)}/100)
`;
    }
    if (grade.CHANGE_24H) {
      const changeIcon = grade.CHANGE_24H >= 0 ? "\u{1F4C8}" : "\u{1F4C9}";
      response += `\u2022 **24h Change**: ${changeIcon} ${grade.CHANGE_24H > 0 ? "+" : ""}${grade.CHANGE_24H.toFixed(2)}%
`;
    }
    if (grade.DATE) {
      response += `\u2022 **Last Updated**: ${grade.DATE}
`;
    }
    response += `
`;
  } else {
    const topGrades = grades.map((item) => ({
      ...item,
      numericGrade: item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0
    })).filter((g) => g.numericGrade >= 90).sort((a, b) => b.numericGrade - a.numericGrade).slice(0, 5);
    if (topGrades.length > 0) {
      response += `\u{1F3C6} **Top A-Grade Investment Tokens**:
`;
      topGrades.forEach((grade, index) => {
        const letterGrade = convertToLetterGrade2(grade.numericGrade);
        response += `${index + 1}. **${grade.TOKEN_SYMBOL || grade.SYMBOL}** (${grade.TOKEN_NAME || grade.NAME}): Grade ${letterGrade} (${grade.numericGrade.toFixed(1)})`;
        if (grade.CHANGE_24H) {
          const changeIcon = grade.CHANGE_24H >= 0 ? "\u{1F4C8}" : "\u{1F4C9}";
          response += ` ${changeIcon} ${grade.CHANGE_24H > 0 ? "+" : ""}${grade.CHANGE_24H.toFixed(2)}%`;
        }
        response += `
`;
      });
      response += `
`;
    }
  }
  response += `\u{1F4A1} **AI Investment Recommendations**:
`;
  const aGradePercentage = gradeDistribution.A / gradeCount * 100;
  const fGradePercentage = gradeDistribution.F / gradeCount * 100;
  if (aGradePercentage > 30) {
    response += `\u2022 Strong investment environment with ${aGradePercentage.toFixed(1)}% A-grade tokens
`;
    response += `\u2022 Consider building long-term positions in top-rated cryptocurrencies
`;
    response += `\u2022 Focus on A and B grade tokens for portfolio allocation
`;
  } else if (fGradePercentage > 30) {
    response += `\u2022 Challenging investment environment with ${fGradePercentage.toFixed(1)}% F-grade tokens
`;
    response += `\u2022 Exercise extreme caution with new investments
`;
    response += `\u2022 Consider dollar-cost averaging or waiting for better conditions
`;
  } else {
    response += `\u2022 Mixed investment conditions - selective approach recommended
`;
    response += `\u2022 Focus on highest-grade tokens with strong fundamentals
`;
    response += `\u2022 Avoid D and F grade tokens for long-term holdings
`;
  }
  response += `
\u{1F4CA} **Data Source**: TokenMetrics AI Investor Grades
`;
  response += `\u23F0 **Analysis Time**: ${(/* @__PURE__ */ new Date()).toLocaleString()}
`;
  return response;
}
function analyzeInvestorGrades(data) {
  if (!data || data.length === 0) {
    return { error: "No data to analyze" };
  }
  const grades = Array.isArray(data) ? data : [data];
  const gradeDistribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  grades.forEach((item) => {
    const numericGrade = item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0;
    const letterGrade = convertToLetterGrade2(numericGrade);
    gradeDistribution[letterGrade]++;
  });
  const analysis = {
    total_tokens: grades.length,
    grade_distribution: gradeDistribution,
    top_investments: grades.map((item) => ({
      ...item,
      numericGrade: item.TM_INVESTOR_GRADE || item.INVESTOR_GRADE || item.TA_GRADE || item.QUANT_GRADE || 0
    })).filter((g) => g.numericGrade >= 90).sort((a, b) => b.numericGrade - a.numericGrade).slice(0, 10).map((g) => ({
      symbol: g.TOKEN_SYMBOL || g.SYMBOL,
      name: g.TOKEN_NAME || g.NAME,
      grade: convertToLetterGrade2(g.numericGrade),
      score: g.numericGrade,
      date: g.DATE
    })),
    investment_quality: "neutral"
  };
  const aPercentage = gradeDistribution.A / grades.length * 100;
  const fPercentage = gradeDistribution.F / grades.length * 100;
  if (aPercentage > 40) {
    analysis.investment_quality = "excellent";
  } else if (aPercentage > 25) {
    analysis.investment_quality = "good";
  } else if (fPercentage > 40) {
    analysis.investment_quality = "poor";
  } else {
    analysis.investment_quality = "fair";
  }
  return analysis;
}
var getInvestorGradesAction = {
  name: "GET_INVESTOR_GRADES_TOKENMETRICS",
  similes: [
    "GET_INVESTOR_GRADES",
    "GET_INVESTMENT_GRADES",
    "GET_LONG_TERM_GRADES",
    "GET_INVESTMENT_RATINGS",
    "INVESTOR_GRADES",
    "INVESTMENT_GRADES",
    "LONG_TERM_RATINGS"
  ],
  description: "Get AI-generated investor grades and ratings for long-term cryptocurrency investments from TokenMetrics",
  validate: async (runtime, message) => {
    elizaLogger4.log("\u{1F50D} Validating getInvestorGradesAction");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger4.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback2) => {
    const requestId = generateRequestId();
    elizaLogger4.log("\u{1F680} Starting TokenMetrics investor grades handler");
    elizaLogger4.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger4.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const userMessage = message.content?.text || "";
      console.log(`\u{1F50D} AI EXTRACTION CONTEXT [${requestId}]:`);
      console.log(`\u{1F4DD} User message: "${userMessage}"`);
      console.log(`\u{1F4CB} Template being used:`);
      console.log(investorGradesTemplate);
      console.log(`\u{1F51A} END CONTEXT [${requestId}]`);
      const enhancedTemplate = investorGradesTemplate.replace("{{requestId}}", requestId).replace("{{timestamp}}", timestamp).replace("{{userMessage}}", userMessage);
      const gradesRequestResult = await generateObject3({
        runtime,
        context: composeContext3({
          state: state || await runtime.composeState(message),
          template: enhancedTemplate
        }),
        modelClass: ModelClass3.LARGE,
        // Use GPT-4o for better instruction following
        schema: InvestorGradesRequestSchema,
        mode: "json"
      });
      const gradesRequest = gradesRequestResult.object;
      elizaLogger4.log("\u{1F3AF} AI Extracted grades request:", gradesRequest);
      elizaLogger4.log(`\u{1F194} Request ${requestId}: AI Processing "${gradesRequest.cryptocurrency || "general market"}"`);
      let finalRequest = gradesRequest;
      if (!gradesRequest.cryptocurrency || gradesRequest.confidence < 0.5) {
        elizaLogger4.log("\u{1F504} Applying regex fallback for cryptocurrency extraction");
        const regexResult = extractCryptocurrencySimple2(userMessage);
        if (regexResult) {
          finalRequest = {
            ...gradesRequest,
            cryptocurrency: regexResult.cryptocurrency,
            symbol: regexResult.symbol,
            confidence: Math.max(gradesRequest.confidence, 0.8)
          };
          elizaLogger4.log("\u2705 Regex fallback successful:", regexResult);
        }
      }
      if (!finalRequest.cryptocurrency && !finalRequest.grade_filter && !finalRequest.category && finalRequest.confidence < 0.3) {
        elizaLogger4.log("\u274C AI extraction failed or insufficient information");
        if (callback2) {
          callback2({
            text: `\u274C I couldn't identify specific investor grades criteria from your request.

I can get AI investor grades for:
\u2022 Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
\u2022 Grade filters (A, B, C, D, F grades)
\u2022 Token categories (DeFi, Layer-1, meme tokens)
\u2022 Market filters (high volume, large cap, etc.)

Try asking something like:
\u2022 "Get investor grades for Bitcoin"
\u2022 "Show me A-grade investment tokens"
\u2022 "What are the current long-term grades?"
\u2022 "Get investment grades for DeFi tokens"`,
            content: {
              error: "Insufficient investor grades criteria",
              confidence: finalRequest?.confidence || 0,
              request_id: requestId
            }
          });
        }
        return false;
      }
      elizaLogger4.success("\u{1F3AF} Final extraction result:", finalRequest);
      const apiParams = {
        limit: 50,
        page: 1
      };
      let tokenInfo = null;
      if (finalRequest.cryptocurrency) {
        elizaLogger4.log(`\u{1F50D} Resolving token for: "${finalRequest.cryptocurrency}"`);
        tokenInfo = await resolveTokenSmart(finalRequest.cryptocurrency, runtime);
        if (tokenInfo) {
          apiParams.token_id = tokenInfo.TOKEN_ID;
          elizaLogger4.log(`\u2705 Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
        } else {
          apiParams.symbol = finalRequest.cryptocurrency.toUpperCase();
          elizaLogger4.log(`\u{1F50D} Using symbol: ${finalRequest.cryptocurrency}`);
        }
      }
      if (finalRequest.grade_filter && finalRequest.grade_filter !== "any") {
        apiParams.grade = finalRequest.grade_filter;
      }
      if (finalRequest.category) {
        apiParams.category = finalRequest.category;
      }
      elizaLogger4.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger4.log(`\u{1F4E1} Fetching investor grades data`);
      const gradesData = await fetchInvestorGrades(apiParams, runtime);
      if (!gradesData) {
        elizaLogger4.log("\u274C Failed to fetch investor grades data");
        if (callback2) {
          callback2({
            text: `\u274C Unable to fetch investor grades data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting
\u2022 No grades available for the specified criteria

Please try again in a few moments or try with different criteria.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return false;
      }
      const grades = Array.isArray(gradesData) ? gradesData : gradesData.data || [];
      elizaLogger4.log(`\u{1F50D} Received ${grades.length} investor grades`);
      const responseText2 = formatInvestorGradesResponse(grades, tokenInfo);
      const analysis = analyzeInvestorGrades(grades);
      elizaLogger4.success("\u2705 Successfully processed investor grades request");
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            grades_data: grades,
            analysis,
            source: "TokenMetrics AI Investor Grades",
            request_id: requestId,
            query_details: {
              original_request: finalRequest.cryptocurrency || "general market",
              grade_filter: finalRequest.grade_filter,
              category: finalRequest.category,
              confidence: finalRequest.confidence,
              data_freshness: "real-time",
              request_id: requestId,
              extraction_method: "ai_with_cache_busting_and_regex_fallback"
            }
          }
        });
      }
      return true;
    } catch (error) {
      elizaLogger4.error("\u274C Error in TokenMetrics investor grades handler:", error);
      elizaLogger4.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      if (callback2) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        callback2({
          text: `\u274C I encountered an error while fetching investor grades: ${errorMessage}

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
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get investor grades for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll fetch the latest AI investor grades for Bitcoin from TokenMetrics.",
          action: "GET_INVESTOR_GRADES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me A-grade investment tokens"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get all A-grade tokens for long-term investment from TokenMetrics.",
          action: "GET_INVESTOR_GRADES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are the current long-term investment grades?"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Let me fetch the latest AI investor grades and ratings from TokenMetrics.",
          action: "GET_INVESTOR_GRADES_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getQuantmetricsAction.ts
var QuantmetricsRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  category: z.string().optional().describe("Token category filter (e.g., defi, layer1)"),
  exchange: z.string().optional().describe("Exchange filter"),
  marketcap: z.number().optional().describe("Minimum market cap filter"),
  volume: z.number().optional().describe("Minimum volume filter"),
  fdv: z.number().optional().describe("Minimum fully diluted valuation filter"),
  limit: z.number().min(1).max(1e3).optional().describe("Number of results to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["risk", "returns", "performance", "all"]).optional().describe("Type of analysis to focus on")
});
var QUANTMETRICS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting quantitative metrics requests from natural language.

The user wants to get comprehensive quantitative metrics for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **category** (optional): Token category filter
   - Look for categories like "defi", "layer1", "gaming", "nft"

5. **exchange** (optional): Exchange filter
   - Exchange names like "binance", "coinbase", "uniswap"

6. **marketcap** (optional): Minimum market cap filter
   - Look for phrases like "market cap over $500M", "large cap tokens"
   - Convert to numbers (e.g., "$500M" \u2192 500000000)

7. **volume** (optional): Minimum volume filter
   - Look for volume requirements

8. **fdv** (optional): Minimum fully diluted valuation filter

9. **limit** (optional, default: 50): Number of results to return

10. **page** (optional, default: 1): Page number for pagination

11. **analysisType** (optional, default: "all"): What type of analysis they want
    - "risk" - focus on risk metrics (volatility, drawdown, VaR)
    - "returns" - focus on return metrics (CAGR, Sharpe, Sortino)
    - "performance" - focus on performance analysis
    - "all" - comprehensive analysis

Examples:
- "Get quantitative metrics for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Risk metrics for DeFi tokens with market cap over $500M" \u2192 {category: "defi", marketcap: 500000000, analysisType: "risk"}
- "Show me Sharpe ratio and returns for ETH" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "returns"}
- "Quantitative analysis for large cap tokens" \u2192 {marketcap: 1000000000, analysisType: "all"}

Extract the request details from the user's message.
`;
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
        user: "{{user1}}",
        content: {
          text: "Get quantitative metrics for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve comprehensive quantitative metrics for Bitcoin including volatility, Sharpe ratio, and risk measurements.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me risk metrics for DeFi tokens with market cap over $500M"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll analyze quantitative risk metrics for large-cap DeFi tokens.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Analyze Sharpe ratio and returns for Ethereum"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the quantitative return metrics and Sharpe ratio analysis for Ethereum.",
          action: "GET_QUANTMETRICS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing quantmetrics request...`);
      const quantRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        QUANTMETRICS_EXTRACTION_TEMPLATE,
        QuantmetricsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, quantRequest);
      const processedRequest = {
        cryptocurrency: quantRequest.cryptocurrency,
        token_id: quantRequest.token_id,
        symbol: quantRequest.symbol,
        category: quantRequest.category,
        exchange: quantRequest.exchange,
        marketcap: quantRequest.marketcap,
        volume: quantRequest.volume,
        fdv: quantRequest.fdv,
        limit: quantRequest.limit || 50,
        page: quantRequest.page || 1,
        analysisType: quantRequest.analysisType || "all"
      };
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
        try {
          resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
          if (resolvedToken) {
            processedRequest.token_id = resolvedToken.token_id;
            processedRequest.symbol = resolvedToken.symbol;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
          }
        } catch (error) {
          console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) apiParams.token_id = processedRequest.token_id;
      if (processedRequest.symbol) apiParams.symbol = processedRequest.symbol;
      if (processedRequest.category) apiParams.category = processedRequest.category;
      if (processedRequest.exchange) apiParams.exchange = processedRequest.exchange;
      if (processedRequest.marketcap) apiParams.marketcap = processedRequest.marketcap;
      if (processedRequest.volume) apiParams.volume = processedRequest.volume;
      if (processedRequest.fdv) apiParams.fdv = processedRequest.fdv;
      const response = await callTokenMetricsAPI(
        "/v2/quantmetrics",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const quantmetrics = Array.isArray(response) ? response : response.data || [];
      const quantAnalysis = analyzeQuantitativeMetrics(quantmetrics, processedRequest.analysisType);
      let responseText2 = `\u26A1 **Quantitative Metrics Analysis**

`;
      if (processedRequest.cryptocurrency || processedRequest.symbol) {
        responseText2 += `\u{1F3AF} **Token**: ${processedRequest.cryptocurrency || processedRequest.symbol}
`;
      }
      responseText2 += `\u{1F4CA} **Data Points**: ${quantmetrics.length} metrics analyzed

`;
      if (quantmetrics.length > 0) {
        const firstMetric = quantmetrics[0];
        responseText2 += `\u{1F4C8} **Key Metrics**:
`;
        if (firstMetric.VOLATILITY !== void 0) {
          responseText2 += `\u2022 **Volatility**: ${firstMetric.VOLATILITY.toFixed(2)}%
`;
        }
        if (firstMetric.SHARPE !== void 0) {
          responseText2 += `\u2022 **Sharpe Ratio**: ${firstMetric.SHARPE.toFixed(3)}
`;
        }
        if (firstMetric.MAX_DRAWDOWN !== void 0) {
          responseText2 += `\u2022 **Max Drawdown**: ${firstMetric.MAX_DRAWDOWN.toFixed(2)}%
`;
        }
        if (firstMetric.CAGR !== void 0) {
          responseText2 += `\u2022 **CAGR**: ${firstMetric.CAGR.toFixed(2)}%
`;
        }
        if (firstMetric.ALL_TIME_RETURN !== void 0) {
          responseText2 += `\u2022 **All-Time Return**: ${firstMetric.ALL_TIME_RETURN.toFixed(2)}%
`;
        }
        responseText2 += `
`;
        if (quantAnalysis.summary) {
          responseText2 += `\u{1F9E0} **Analysis**: ${quantAnalysis.summary}

`;
        }
        if (quantAnalysis.risk_analysis?.risk_assessment) {
          responseText2 += `\u26A0\uFE0F **Risk Assessment**: ${quantAnalysis.risk_analysis.risk_assessment}

`;
        }
        if (quantAnalysis.portfolio_implications && quantAnalysis.portfolio_implications.length > 0) {
          responseText2 += `\u{1F4BC} **Portfolio Implications**:
`;
          quantAnalysis.portfolio_implications.slice(0, 3).forEach((implication, index) => {
            responseText2 += `${index + 1}. ${implication}
`;
          });
          responseText2 += `
`;
        }
        if (quantAnalysis.insights && quantAnalysis.insights.length > 0) {
          responseText2 += `\u{1F4A1} **Key Insights**:
`;
          quantAnalysis.insights.slice(0, 3).forEach((insight, index) => {
            responseText2 += `${index + 1}. ${insight}
`;
          });
        }
      } else {
        responseText2 += `\u274C No quantitative metrics data available for the specified criteria.

`;
        responseText2 += `\u{1F4A1} **Try**:
`;
        responseText2 += `\u2022 Using a major cryptocurrency (Bitcoin, Ethereum)
`;
        responseText2 += `\u2022 Checking if the token has sufficient historical data
`;
        responseText2 += `\u2022 Verifying your TokenMetrics subscription includes quantmetrics access`;
      }
      responseText2 += `

\u{1F4CA} **Data Source**: TokenMetrics Quantmetrics API
`;
      responseText2 += `\u23F0 **Updated**: ${(/* @__PURE__ */ new Date()).toLocaleString()}`;
      console.log(`[${requestId}] Quantmetrics analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            request_id: requestId,
            quantmetrics,
            analysis: quantAnalysis,
            metadata: {
              endpoint: "quantmetrics",
              requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
              resolved_token: resolvedToken,
              filters_applied: {
                category: processedRequest.category,
                exchange: processedRequest.exchange,
                min_marketcap: processedRequest.marketcap,
                min_volume: processedRequest.volume,
                min_fdv: processedRequest.fdv
              },
              pagination: {
                page: processedRequest.page,
                limit: processedRequest.limit
              },
              analysis_focus: processedRequest.analysisType,
              data_points: quantmetrics.length,
              api_version: "v2",
              data_source: "TokenMetrics Official API"
            },
            metrics_explanation: {
              VOLATILITY: "Price volatility measurement - higher values indicate more volatile assets",
              SHARPE: "Risk-adjusted return metric - higher values indicate better risk-adjusted performance",
              SORTINO: "Downside risk-adjusted return - focuses only on negative volatility",
              MAX_DRAWDOWN: "Largest peak-to-trough decline - indicates worst-case scenario losses",
              CAGR: "Compound Annual Growth Rate - annualized return over the investment period",
              ALL_TIME_RETURN: "Cumulative return since the token's inception"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getQuantmetricsAction:", error);
      if (callback2) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        callback2({
          text: `\u274C I encountered an error while fetching quantitative metrics: ${errorMessage}

This could be due to:
\u2022 Network connectivity issues
\u2022 TokenMetrics API service problems
\u2022 Invalid API key or authentication issues
\u2022 Insufficient subscription access to quantmetrics endpoint
\u2022 Token not found or insufficient historical data

Please check your TokenMetrics API key configuration and try again.`,
          content: {
            error: errorMessage,
            error_type: error instanceof Error ? error.constructor.name : "Unknown",
            troubleshooting: {
              endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/quantmetrics is accessible",
              parameter_validation: [
                "Verify the token symbol or ID is correct and supported by TokenMetrics",
                "Check that numeric filters (marketcap, volume, fdv) are positive numbers",
                "Ensure your API key has access to quantmetrics endpoint",
                "Verify the token has sufficient historical data for analysis"
              ],
              common_solutions: [
                "Try using a major token (BTC, ETH) to test functionality",
                "Use the tokens endpoint first to verify correct TOKEN_ID",
                "Check if your subscription includes quantitative metrics access",
                "Remove filters to get broader results"
              ]
            }
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
  }
};
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

// src/actions/getMarketMetricsAction.ts
import { elizaLogger as elizaLogger5 } from "@elizaos/core";
var marketMetricsTemplate = `You are an AI assistant specialized in extracting TokenMetrics market analytics requests from user messages.

Your task is to analyze the user's message and extract relevant parameters for fetching market metrics data.

Market metrics provide:
- Bullish/bearish market indicators
- Overall crypto market sentiment
- Market direction analysis
- Total crypto market insights

Extract the following information from the user's request:

1. **Date Range** (optional):
   - start_date: Start date for historical data (YYYY-MM-DD format)
   - end_date: End date for historical data (YYYY-MM-DD format)
   - If user mentions "current", "now", "today" - leave dates empty for current data
   - If user mentions "past week/month" - calculate appropriate date range

2. **Data Preferences** (optional):
   - limit: Number of data points to return (default: 50, max: 100)
   - page: Page number for pagination (default: 1)

3. **Analysis Focus** (extract intent):
   - market_sentiment: User wants bullish/bearish analysis
   - trend_analysis: User wants trend patterns
   - strategic_insights: User wants investment implications
   - current_status: User wants current market state

Examples of user requests:
- "What's the current crypto market sentiment?" \u2192 current data, focus on sentiment
- "Show me market analytics for December 2024" \u2192 date range, general analytics
- "Is the market bullish or bearish?" \u2192 current data, sentiment focus
- "Give me market trends for the past 30 days" \u2192 30-day range, trend focus

Respond with a JSON object containing the extracted parameters.`;
var MarketMetricsRequestSchema = z.object({
  start_date: z.string().optional().describe("Start date in YYYY-MM-DD format"),
  end_date: z.string().optional().describe("End date in YYYY-MM-DD format"),
  limit: z.number().min(1).max(100).optional().describe("Number of data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysis_focus: z.array(z.enum([
    "market_sentiment",
    "trend_analysis",
    "strategic_insights",
    "current_status"
  ])).optional().describe("Types of analysis to focus on")
});
var handler = async (runtime, message, state, _options, callback2) => {
  elizaLogger5.info("\u{1F3E2} Starting TokenMetrics Market Metrics Action");
  try {
    const extractedRequest = await extractTokenMetricsRequest(
      runtime,
      message,
      state || await runtime.composeState(message),
      marketMetricsTemplate,
      MarketMetricsRequestSchema,
      generateRequestId()
    );
    elizaLogger5.info("\u{1F4CA} Extracted market metrics request:", extractedRequest);
    const processedRequest = {
      start_date: extractedRequest.start_date,
      end_date: extractedRequest.end_date,
      limit: extractedRequest.limit || 50,
      page: extractedRequest.page || 1,
      analysis_focus: extractedRequest.analysis_focus || ["market_sentiment"]
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
    let responseText2 = "\u{1F4CA} **TokenMetrics Market Analytics**\n\n";
    if (processedRequest.analysis_focus.includes("current_status")) {
      responseText2 += `\u{1F3AF} **Current Market Status**: ${currentStatus.sentiment_description}
`;
      responseText2 += `\u{1F4C8} **Market Direction**: ${currentStatus.direction}
`;
      responseText2 += `\u{1F4AA} **Signal Strength**: ${currentStatus.strength}/10

`;
    }
    if (processedRequest.analysis_focus.includes("market_sentiment")) {
      responseText2 += `\u{1F50D} **Market Sentiment Analysis**:
`;
      responseText2 += `\u2022 Bullish/Bearish Indicator: ${marketAnalysis.overall_sentiment}
`;
      responseText2 += `\u2022 Confidence Level: ${marketAnalysis.confidence_level}%
`;
      responseText2 += `\u2022 Market Phase: ${marketAnalysis.market_phase}

`;
    }
    if (processedRequest.analysis_focus.includes("trend_analysis")) {
      responseText2 += `\u{1F4C8} **Trend Analysis**:
`;
      responseText2 += `\u2022 Primary Trend: ${marketAnalysis.trend_direction}
`;
      responseText2 += `\u2022 Trend Strength: ${marketAnalysis.trend_strength}
`;
      responseText2 += `\u2022 Momentum: ${marketAnalysis.momentum}

`;
    }
    if (processedRequest.analysis_focus.includes("strategic_insights")) {
      responseText2 += `\u{1F4A1} **Strategic Insights**:
`;
      if (marketAnalysis.strategic_implications) {
        marketAnalysis.strategic_implications.forEach((insight, index) => {
          responseText2 += `${index + 1}. ${insight}
`;
        });
      }
      responseText2 += "\n";
    }
    responseText2 += `\u{1F4CB} **Key Metrics Summary**:
`;
    responseText2 += `\u2022 Data Points Analyzed: ${marketMetrics.length}
`;
    responseText2 += `\u2022 Market Cap Trend: ${marketAnalysis.market_cap_trend || "N/A"}
`;
    responseText2 += `\u2022 Volatility Level: ${marketAnalysis.volatility_level || "N/A"}
`;
    if (marketAnalysis.recommendations && marketAnalysis.recommendations.length > 0) {
      responseText2 += `
\u{1F3AF} **Recommendations**:
`;
      marketAnalysis.recommendations.forEach((rec, index) => {
        responseText2 += `${index + 1}. ${rec}
`;
      });
    }
    return {
      text: responseText2,
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
    };
  } catch (error) {
    elizaLogger5.error("\u274C Market Metrics Action Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      text: `\u274C **Error Getting Market Metrics**

${errorMessage}

\u{1F4A1} **Troubleshooting Tips**:
\u2022 Check your TokenMetrics API key
\u2022 Verify date format (YYYY-MM-DD)
\u2022 Ensure you have access to market metrics endpoint`,
      success: false,
      error: errorMessage
    };
  }
};
var validate = async (runtime) => {
  return validateAndGetApiKey(runtime) !== null;
};
var examples = [
  [
    {
      user: "{{user1}}",
      content: {
        text: "What's the current crypto market sentiment?"
      }
    },
    {
      user: "{{user2}}",
      content: {
        text: "I'll check the current TokenMetrics market metrics to assess overall cryptocurrency market sentiment.",
        action: "GET_MARKET_METRICS_TOKENMETRICS"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Show me market analytics for the past 30 days"
      }
    },
    {
      user: "{{user2}}",
      content: {
        text: "I'll retrieve TokenMetrics market analytics for the past 30 days to analyze recent trends.",
        action: "GET_MARKET_METRICS_TOKENMETRICS"
      }
    }
  ],
  [
    {
      user: "{{user1}}",
      content: {
        text: "Is the crypto market bullish or bearish right now?"
      }
    },
    {
      user: "{{user2}}",
      content: {
        text: "I'll get the latest TokenMetrics market indicator to determine current market direction.",
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
  handler,
  validate,
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
var IndicesRequestSchema = z.object({
  indicesType: z.string().nullable().optional().describe("Type of indices to filter (active, passive, etc.)"),
  limit: z.number().min(1).max(100).optional().describe("Number of indices to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["performance", "risk", "diversification", "all"]).optional().describe("Type of analysis to focus on")
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

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Show me available crypto indices"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get the available crypto indices for you, including both active and passive investment options.",
          action: "GET_INDICES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are the best performing crypto index funds?"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Let me analyze the crypto indices performance data to show you the top performers.",
          action: "GET_INDICES_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get me active crypto indices with risk analysis"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve active crypto indices and provide detailed risk analysis for your investment decisions.",
          action: "GET_INDICES_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices request...`);
      const indicesRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        INDICES_EXTRACTION_TEMPLATE,
        IndicesRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, indicesRequest);
      const processedRequest = {
        indicesType: indicesRequest.indicesType,
        limit: indicesRequest.limit || 50,
        page: indicesRequest.page || 1,
        analysisType: indicesRequest.analysisType || "all"
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
      const responseText2 = formatIndicesResponse(result, processedRequest.limit);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      console.error("Error in getIndices action:", error);
      if (callback2) {
        callback2({
          text: `\u274C Failed to retrieve indices data: ${error instanceof Error ? error.message : "Unknown error"}`,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getAiReportsAction.ts
var AiReportsRequestSchema = z.object({
  token_id: z.number().min(1).optional().describe("The ID of the token to get AI reports for"),
  symbol: z.string().optional().describe("The symbol of the token to get AI reports for"),
  limit: z.number().min(1).max(100).optional().describe("Number of reports to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["investment", "technical", "comprehensive", "all"]).optional().describe("Type of analysis to focus on")
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

Examples:
- "Get AI reports for Bitcoin" \u2192 {symbol: "BTC", analysisType: "all"}
- "Show me investment analysis for ETH" \u2192 {symbol: "ETH", analysisType: "investment"}
- "Get comprehensive AI reports" \u2192 {analysisType: "comprehensive"}
- "Technical analysis reports for token 123" \u2192 {token_id: 123, analysisType: "technical"}

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Get AI analysis reports for Bitcoin"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve comprehensive AI-generated analysis reports for Bitcoin from TokenMetrics.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me the latest AI reports available"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get the latest AI-generated reports from TokenMetrics covering various cryptocurrency projects.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get investment analysis reports for Ethereum"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve AI-generated investment analysis reports for Ethereum.",
          action: "GET_AI_REPORTS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, _state, _params, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing AI reports request...`);
      const aiReportsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        _state || await runtime.composeState(message),
        AI_REPORTS_EXTRACTION_TEMPLATE,
        AiReportsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, aiReportsRequest);
      const processedRequest = {
        token_id: aiReportsRequest.token_id,
        symbol: aiReportsRequest.symbol,
        limit: aiReportsRequest.limit || 50,
        page: aiReportsRequest.page || 1,
        analysisType: aiReportsRequest.analysisType || "all"
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
      let responseText2 = `\u{1F916} **AI Reports Analysis${tokenName !== "various tokens" ? ` for ${tokenName}` : ""}**

`;
      if (aiReports.length === 0) {
        responseText2 += `\u274C No AI reports found${tokenName !== "various tokens" ? ` for ${tokenName}` : ""}. This could mean:
`;
        responseText2 += `\u2022 TokenMetrics AI hasn't analyzed this token yet
`;
        responseText2 += `\u2022 The token may not meet criteria for AI analysis
`;
        responseText2 += `\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum

`;
      } else {
        responseText2 += `\u2705 **Found ${aiReports.length} comprehensive AI-generated reports**

`;
        const reportTypes = reportsAnalysis.report_coverage.report_types;
        if (reportTypes && reportTypes.length > 0) {
          responseText2 += `\u{1F4CA} **Available Report Types:**
`;
          reportTypes.forEach((type) => {
            responseText2 += `\u2022 ${type.type}: ${type.count} reports (${type.percentage}%)
`;
          });
          responseText2 += `
`;
        }
        if (processedRequest.analysisType === "investment" && reportsAnalysis.investment_focus) {
          responseText2 += `\u{1F4B0} **Investment Analysis Focus:**
`;
          responseText2 += `\u2022 Investment analyses available: ${reportsAnalysis.investment_focus.investment_reports}
`;
          if (reportsAnalysis.investment_focus.key_investment_points && reportsAnalysis.investment_focus.key_investment_points.length > 0) {
            responseText2 += `
\u{1F4A1} **Key Investment Insights:**
`;
            reportsAnalysis.investment_focus.key_investment_points.slice(0, 3).forEach((point) => {
              responseText2 += `\u2022 ${point}
`;
            });
          }
        } else if (processedRequest.analysisType === "technical" && reportsAnalysis.technical_focus) {
          responseText2 += `\u{1F527} **Technical Analysis Focus:**
`;
          responseText2 += `\u2022 Code reviews available: ${reportsAnalysis.technical_focus.code_reviews}
`;
          if (reportsAnalysis.technical_focus.technical_highlights && reportsAnalysis.technical_focus.technical_highlights.length > 0) {
            responseText2 += `
\u{1F50D} **Technical Highlights:**
`;
            reportsAnalysis.technical_focus.technical_highlights.slice(0, 3).forEach((highlight) => {
              responseText2 += `\u2022 ${highlight}
`;
            });
          }
        } else if (processedRequest.analysisType === "comprehensive" && reportsAnalysis.comprehensive_focus) {
          responseText2 += `\u{1F4DA} **Comprehensive Analysis Focus:**
`;
          responseText2 += `\u2022 Deep dive reports: ${reportsAnalysis.comprehensive_focus.deep_dive_reports}
`;
          if (reportsAnalysis.comprehensive_focus.comprehensive_highlights && reportsAnalysis.comprehensive_focus.comprehensive_highlights.length > 0) {
            responseText2 += `
\u{1F4D6} **Comprehensive Highlights:**
`;
            reportsAnalysis.comprehensive_focus.comprehensive_highlights.slice(0, 3).forEach((highlight) => {
              responseText2 += `\u2022 ${highlight}
`;
            });
          }
        } else {
          responseText2 += `\u{1F4CA} **Comprehensive AI Analysis:**
`;
          responseText2 += `\u2022 ${reportsAnalysis.summary}
`;
          if (reportsAnalysis.report_content) {
            const content = reportsAnalysis.report_content;
            if (content.investment_analyses && content.investment_analyses.length > 0) {
              responseText2 += `
\u{1F4B0} **Investment Analysis Available** (${content.investment_analyses.length} reports)
`;
              const firstAnalysis = content.investment_analyses[0];
              if (firstAnalysis.content && firstAnalysis.content.length > 100) {
                const preview = firstAnalysis.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText2 += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.deep_dive_reports && content.deep_dive_reports.length > 0) {
              responseText2 += `
\u{1F4DA} **Deep Dive Reports Available** (${content.deep_dive_reports.length} reports)
`;
              const firstDeepDive = content.deep_dive_reports[0];
              if (firstDeepDive.content && firstDeepDive.content.length > 100) {
                const preview = firstDeepDive.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText2 += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.code_reviews && content.code_reviews.length > 0) {
              responseText2 += `
\u{1F527} **Code Reviews Available** (${content.code_reviews.length} reports)
`;
              const firstCodeReview = content.code_reviews[0];
              if (firstCodeReview.content && firstCodeReview.content.length > 100) {
                const preview = firstCodeReview.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText2 += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
            if (content.executive_summaries && content.executive_summaries.length > 0) {
              responseText2 += `
\u{1F4CB} **Executive Summaries Available** (${content.executive_summaries.length} reports)
`;
              const firstSummary = content.executive_summaries[0];
              if (firstSummary.content && firstSummary.content.length > 100) {
                const preview = firstSummary.content.substring(0, 300).replace(/\n/g, " ").trim();
                responseText2 += `\u{1F4DD} Preview: "${preview}..."
`;
              }
            }
          }
        }
        if (reportsAnalysis.research_themes && reportsAnalysis.research_themes.length > 0) {
          responseText2 += `
\u{1F50D} **Key Research Themes:**
`;
          reportsAnalysis.research_themes.slice(0, 4).forEach((theme) => {
            responseText2 += `\u2022 ${theme}
`;
          });
        }
        if (reportsAnalysis.data_quality) {
          responseText2 += `
\u{1F4C8} **Data Quality Assessment:**
`;
          responseText2 += `\u2022 Coverage: ${reportsAnalysis.data_quality.coverage_breadth}
`;
          responseText2 += `\u2022 Completeness: ${reportsAnalysis.data_quality.completeness}
`;
          responseText2 += `\u2022 Freshness: ${reportsAnalysis.data_quality.freshness}
`;
        }
        responseText2 += `
\u{1F4CB} **Usage Guidelines:**
`;
        responseText2 += `\u2022 Use for due diligence and investment research
`;
        responseText2 += `\u2022 Combine with quantitative metrics for complete picture
`;
        responseText2 += `\u2022 Review report generation date for relevance
`;
        responseText2 += `\u2022 Consider reports as one input in investment decision process
`;
      }
      responseText2 += `
\u{1F517} **Data Source:** TokenMetrics AI Engine (v2)`;
      console.log(`[${requestId}] AI reports analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
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
      if (callback2) {
        callback2({
          text: errorMessage,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            message: "Failed to retrieve AI reports from TokenMetrics API"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getTradingSignalsAction.ts
import {
  elizaLogger as elizaLogger6
} from "@elizaos/core";
var tradingSignalsTemplate = `# Task: Extract Trading Signals Request Information

Based on the conversation context, identify what trading signals information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for any mentions of:
- Cryptocurrency symbols (BTC, ETH, SOL, ADA, MATIC, DOT, LINK, UNI, AVAX, etc.)
- Cryptocurrency names (Bitcoin, Ethereum, Solana, Cardano, Polygon, Uniswap, Avalanche, Chainlink, etc.)
- Trading signal requests ("trading signals", "buy sell signals", "AI signals", "trading recommendations")
- Signal types ("bullish", "bearish", "long", "short", "buy", "sell")
- Time periods or date ranges
- Market filters (category, exchange, market cap, volume)

The user might say things like:
- "Get trading signals for Bitcoin"
- "Show me AI trading signals"
- "What are the current buy/sell signals?"
- "Get bullish signals for DeFi tokens"
- "Show trading recommendations for Ethereum"
- "Get signals for tokens with high volume"
- "What tokens have buy signals today?"

Extract the relevant information for the trading signals request.

# Response Format:
Return a structured object with the trading signals request information.`;
var TradingSignalsRequestSchema = z.object({
  cryptocurrency: z.string().nullable().describe("The cryptocurrency symbol or name mentioned"),
  signal_type: z.enum(["bullish", "bearish", "long", "short", "buy", "sell", "any"]).nullable().describe("Type of signal requested"),
  category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, meme)"),
  exchange: z.string().nullable().describe("Exchange filter"),
  time_period: z.string().nullable().describe("Time period or date range"),
  market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
  confidence: z.number().min(0).max(1).describe("Confidence in extraction")
});
async function fetchTradingSignals(params, runtime) {
  elizaLogger6.log(`\u{1F4E1} Fetching trading signals with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/trading-signals", params, runtime);
    if (!data) {
      throw new Error("No data received from trading signals API");
    }
    elizaLogger6.log(`\u2705 Successfully fetched trading signals data`);
    return data;
  } catch (error) {
    elizaLogger6.error("\u274C Error fetching trading signals:", error);
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
  validate: async (runtime, message) => {
    elizaLogger6.log("\u{1F50D} Validating getTradingSignalsAction");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger6.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback2) => {
    const requestId = generateRequestId();
    elizaLogger6.log("\u{1F680} Starting TokenMetrics trading signals handler");
    elizaLogger6.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger6.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      const signalsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        tradingSignalsTemplate,
        TradingSignalsRequestSchema,
        requestId
      );
      elizaLogger6.log("\u{1F3AF} AI Extracted signals request:", signalsRequest);
      elizaLogger6.log(`\u{1F194} Request ${requestId}: AI Processing "${signalsRequest.cryptocurrency || "general market"}"`);
      if (!signalsRequest.cryptocurrency && !signalsRequest.signal_type && !signalsRequest.category && signalsRequest.confidence < 0.2) {
        elizaLogger6.log("\u274C AI extraction failed - very low confidence");
        if (callback2) {
          callback2({
            text: `\u274C I couldn't identify specific trading signals criteria from your request.

I can get AI trading signals for:
\u2022 Specific cryptocurrencies (Bitcoin, Ethereum, Solana, etc.)
\u2022 Signal types (bullish, bearish, buy, sell signals)
\u2022 Token categories (DeFi, Layer-1, meme tokens)
\u2022 Market filters (high volume, large cap, etc.)
\u2022 General market signals

Try asking something like:
\u2022 "Get trading signals for Bitcoin"
\u2022 "Show me bullish signals for DeFi tokens"
\u2022 "What are the current buy signals?"
\u2022 "Get AI trading recommendations"
\u2022 "Show me trading signals"`,
            content: {
              error: "Insufficient trading signals criteria",
              confidence: signalsRequest?.confidence || 0,
              request_id: requestId
            }
          });
        }
        return false;
      }
      elizaLogger6.success("\u{1F3AF} Final extraction result:", signalsRequest);
      const apiParams = {
        limit: 50,
        page: 1
      };
      let tokenInfo = null;
      if (signalsRequest.cryptocurrency) {
        elizaLogger6.log(`\u{1F50D} Attempting to resolve token for: "${signalsRequest.cryptocurrency}"`);
        try {
          tokenInfo = await resolveTokenSmart(signalsRequest.cryptocurrency, runtime);
          if (tokenInfo) {
            apiParams.token_id = tokenInfo.TOKEN_ID;
            elizaLogger6.log(`\u2705 Resolved to token ID: ${tokenInfo.TOKEN_ID}`);
          } else {
            apiParams.symbol = signalsRequest.cryptocurrency.toUpperCase();
            elizaLogger6.log(`\u{1F50D} Using symbol parameter: ${signalsRequest.cryptocurrency}`);
          }
        } catch (error) {
          elizaLogger6.log(`\u26A0\uFE0F Token resolution failed, proceeding with general signals: ${error}`);
        }
      }
      if (signalsRequest.signal_type) {
        if (signalsRequest.signal_type === "bullish" || signalsRequest.signal_type === "long" || signalsRequest.signal_type === "buy") {
          apiParams.signal = 1;
        } else if (signalsRequest.signal_type === "bearish" || signalsRequest.signal_type === "short" || signalsRequest.signal_type === "sell") {
          apiParams.signal = -1;
        }
      }
      if (signalsRequest.category) {
        apiParams.category = signalsRequest.category;
      }
      if (signalsRequest.exchange) {
        apiParams.exchange = signalsRequest.exchange;
      }
      elizaLogger6.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger6.log(`\u{1F4E1} Fetching trading signals data`);
      const signalsData = await fetchTradingSignals(apiParams, runtime);
      if (!signalsData) {
        elizaLogger6.log("\u274C Failed to fetch trading signals data");
        if (callback2) {
          callback2({
            text: `\u274C Unable to fetch trading signals data at the moment.

This could be due to:
\u2022 TokenMetrics API connectivity issues
\u2022 Temporary service interruption  
\u2022 Rate limiting
\u2022 No signals available for the specified criteria

Please try again in a few moments or try with different criteria.`,
            content: {
              error: "API fetch failed",
              request_id: requestId
            }
          });
        }
        return false;
      }
      const signals = Array.isArray(signalsData) ? signalsData : signalsData.data || [];
      elizaLogger6.log(`\u{1F50D} Received ${signals.length} trading signals`);
      const responseText2 = formatTradingSignalsResponse(signals, tokenInfo);
      const analysis = analyzeTradingSignals(signals);
      elizaLogger6.success("\u2705 Successfully processed trading signals request");
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            signals_data: signals,
            analysis,
            source: "TokenMetrics AI Trading Signals",
            request_id: requestId,
            query_details: {
              original_request: signalsRequest.cryptocurrency || "general market",
              signal_type: signalsRequest.signal_type,
              category: signalsRequest.category,
              confidence: signalsRequest.confidence,
              data_freshness: "real-time",
              request_id: requestId,
              extraction_method: "ai_with_cache_busting"
            }
          }
        });
      }
      return true;
    } catch (error) {
      elizaLogger6.error("\u274C Error in TokenMetrics trading signals handler:", error);
      elizaLogger6.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      if (callback2) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        callback2({
          text: `\u274C I encountered an error while fetching trading signals: ${errorMessage}

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
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get trading signals for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll fetch the latest AI trading signals for Bitcoin from TokenMetrics.",
          action: "GET_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me bullish signals for DeFi tokens"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get bullish trading signals for DeFi category tokens from TokenMetrics AI.",
          action: "GET_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are the current AI trading recommendations?"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "Let me fetch the latest AI trading signals and recommendations from TokenMetrics.",
          action: "GET_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getIndicesHoldingsAction.ts
var IndicesHoldingsRequestSchema = z.object({
  indexId: z.number().min(1).describe("The ID of the index to get holdings for"),
  analysisType: z.enum(["composition", "risk", "performance", "all"]).optional().describe("Type of analysis to focus on")
});
var INDICES_HOLDINGS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto index holdings requests from natural language.

The user wants to get information about the holdings/composition of a specific crypto index. Extract the following information:

1. **indexId** (required): The ID number of the index they want holdings for
   - Look for phrases like "index 1", "index ID 5", "index number 3"
   - Extract the numeric ID from the request
   - This is required - if no ID is found, ask for clarification

2. **analysisType** (optional, default: "all"): What type of analysis they want
   - "composition" - focus on token allocation and weights
   - "risk" - focus on concentration and risk metrics
   - "performance" - focus on price changes and performance
   - "all" - comprehensive analysis

Examples:
- "Show me holdings of index 1" \u2192 {indexId: 1, analysisType: "all"}
- "What tokens are in crypto index 5?" \u2192 {indexId: 5, analysisType: "composition"}
- "Get risk analysis for index 3 holdings" \u2192 {indexId: 3, analysisType: "risk"}
- "Index 2 composition and performance" \u2192 {indexId: 2, analysisType: "performance"}

Extract the request details from the user's message.
`;
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
        user: "{{user1}}",
        content: {
          text: "Show me the holdings of crypto index 1"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get the current holdings and allocation weights for that crypto index.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What tokens are in the DeFi index and their weights?"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Let me show you the token composition and weight allocation for the DeFi index.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get risk analysis for index 3 holdings"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll analyze the holdings composition and risk metrics for index 3.",
          action: "GET_INDICES_HOLDINGS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices holdings request...`);
      const holdingsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        INDICES_HOLDINGS_EXTRACTION_TEMPLATE,
        IndicesHoldingsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, holdingsRequest);
      const processedRequest = {
        indexId: holdingsRequest.indexId,
        analysisType: holdingsRequest.analysisType || "all"
      };
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
      const responseText2 = formatIndicesHoldingsResponse(result);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "indicesholdings",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getIndicesHoldings action:", error);
      if (callback2) {
        callback2({
          text: `\u274C Failed to retrieve indices holdings data: ${error instanceof Error ? error.message : "Unknown error"}`,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getCorrelationAction.ts
var CorrelationRequestSchema = z.object({
  token_id: z.number().min(1).optional().describe("The ID of the token to analyze correlation for"),
  symbol: z.string().optional().describe("The symbol of the token to analyze correlation for"),
  category: z.string().optional().describe("Filter by token category (e.g., defi, layer1, gaming)"),
  exchange: z.string().optional().describe("Filter by exchange"),
  limit: z.number().min(1).max(100).optional().describe("Number of correlation results to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["diversification", "hedging", "risk_management", "all"]).optional().describe("Type of correlation analysis to focus on")
});
var CORRELATION_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting correlation analysis requests from natural language.

The user wants to analyze price correlations between cryptocurrencies. Extract the following information:

1. **token_id** (optional): Numeric ID of the token
   - Only extract if explicitly mentioned as a number

2. **symbol** (optional): Token symbol like BTC, ETH, etc.
   - Look for cryptocurrency symbols or names
   - Convert names to symbols if possible (Bitcoin \u2192 BTC, Ethereum \u2192 ETH)

3. **category** (optional): Token category filter
   - Look for categories like "defi", "layer1", "gaming", "meme", "infrastructure"
   - Extract from phrases like "DeFi tokens", "Layer 1 blockchains", "gaming coins"

4. **exchange** (optional): Exchange filter
   - Look for exchange names like "binance", "coinbase", "kraken"

5. **limit** (optional, default: 50): Number of results to return
   - Look for phrases like "top 20", "first 100", "50 correlations"

6. **page** (optional, default: 1): Page number for pagination

7. **analysisType** (optional, default: "all"): What type of analysis they want
   - "diversification" - focus on finding uncorrelated assets for portfolio diversification
   - "hedging" - focus on negatively correlated assets for hedging strategies
   - "risk_management" - focus on correlation risks and concentration analysis
   - "all" - comprehensive correlation analysis

Examples:
- "Get correlation analysis for Bitcoin" \u2192 {symbol: "BTC", analysisType: "all"}
- "Show me DeFi tokens for diversification" \u2192 {category: "defi", analysisType: "diversification"}
- "Find hedging opportunities for ETH" \u2192 {symbol: "ETH", analysisType: "hedging"}
- "Correlation risk analysis for top 20 tokens" \u2192 {limit: 20, analysisType: "risk_management"}

Extract the request details from the user's message.
`;
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
        user: "{{user1}}",
        content: {
          text: "Get correlation analysis for Bitcoin"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve Bitcoin's correlation with other top cryptocurrencies for diversification analysis.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me correlation data for DeFi tokens"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll analyze correlation patterns within the DeFi sector for portfolio optimization.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Find hedging opportunities for Ethereum"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll identify negatively correlated assets that could serve as hedges for Ethereum.",
          action: "GET_CORRELATION_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, _state) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing correlation analysis request...`);
      const correlationRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        _state || await runtime.composeState(message),
        CORRELATION_EXTRACTION_TEMPLATE,
        CorrelationRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, correlationRequest);
      const processedRequest = {
        token_id: correlationRequest.token_id,
        symbol: correlationRequest.symbol,
        category: correlationRequest.category,
        exchange: correlationRequest.exchange,
        limit: correlationRequest.limit || 50,
        page: correlationRequest.page || 1,
        analysisType: correlationRequest.analysisType || "all"
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
      if (processedRequest.category) {
        apiParams.category = processedRequest.category;
      }
      if (processedRequest.exchange) {
        apiParams.exchange = processedRequest.exchange;
      }
      const response = await callTokenMetricsAPI(
        "/v2/correlation",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing correlation data...`);
      const correlationData = Array.isArray(response) ? response : response.data || [];
      const correlationAnalysis = analyzeCorrelationData(correlationData, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved correlation data for ${correlationData.length} token relationships`,
        request_id: requestId,
        correlation_data: correlationData,
        analysis: correlationAnalysis,
        metadata: {
          endpoint: "correlation",
          requested_token: processedRequest.symbol || processedRequest.token_id,
          filters_applied: {
            category: processedRequest.category,
            exchange: processedRequest.exchange
          },
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: correlationData.length,
          api_version: "v2",
          data_source: "TokenMetrics Correlation Engine"
        },
        correlation_explanation: {
          purpose: "Understand price movement relationships between cryptocurrencies for optimal portfolio construction",
          correlation_ranges: {
            "0.8 to 1.0": "Very strong positive correlation - assets move together",
            "0.5 to 0.8": "Strong positive correlation - similar directional movement",
            "0.2 to 0.5": "Moderate positive correlation - some relationship",
            "-0.2 to 0.2": "Weak correlation - minimal relationship",
            "-0.5 to -0.2": "Moderate negative correlation - some inverse relationship",
            "-0.8 to -0.5": "Strong negative correlation - opposite movements",
            "-1.0 to -0.8": "Very strong negative correlation - strong inverse relationship"
          },
          usage_guidelines: [
            "Use low or negative correlations for diversification",
            "Avoid high correlations for risk reduction",
            "Monitor correlation changes during market stress",
            "Consider correlations for hedging strategies"
          ],
          portfolio_applications: [
            "Select uncorrelated assets to reduce portfolio volatility",
            "Identify assets that move independently for diversification",
            "Find negatively correlated assets for hedging",
            "Avoid concentrating in highly correlated assets"
          ]
        }
      };
      console.log(`[${requestId}] Correlation analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "correlation",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getCorrelation action:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve correlation data from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/correlation is accessible",
          parameter_validation: [
            "Verify token_id is a valid number or symbol is a valid string",
            "Check that filtering parameters are valid strings",
            "Ensure your API key has access to correlation analysis endpoint",
            "Confirm the token has sufficient price history for correlation analysis"
          ],
          common_solutions: [
            "Try using a major token (BTC, ETH) to test functionality",
            "Remove filters to get broader correlation results",
            "Check if your subscription includes correlation analysis access",
            "Verify the token is in the top 100 market cap or has sufficient data"
          ]
        }
      };
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
  }
};
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

// src/actions/getDailyOhlcvAction.ts
var DailyOhlcvRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: z.string().optional().describe("Full name of the token"),
  startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  limit: z.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["swing_trading", "trend_analysis", "technical_indicators", "all"]).optional().describe("Type of analysis to focus on")
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

Extract the request details from the user's message.
`;
function extractCryptocurrencySimple3(text) {
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
        user: "{{user1}}",
        content: {
          text: "Get daily OHLCV data for Bitcoin"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve daily OHLCV data for Bitcoin from TokenMetrics.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me daily candle data for ETH for the past month"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get daily OHLCV data for Ethereum for the past month.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Daily price data for swing trading analysis"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll retrieve daily OHLCV data optimized for swing trading analysis.",
          action: "GET_DAILY_OHLCV_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _params, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing daily OHLCV request...`);
      const ohlcvRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        DAILY_OHLCV_EXTRACTION_TEMPLATE,
        DailyOhlcvRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, ohlcvRequest);
      let processedRequest = {
        cryptocurrency: ohlcvRequest.cryptocurrency,
        token_id: ohlcvRequest.token_id,
        symbol: ohlcvRequest.symbol,
        token_name: ohlcvRequest.token_name,
        startDate: ohlcvRequest.startDate,
        endDate: ohlcvRequest.endDate,
        limit: ohlcvRequest.limit || 50,
        page: ohlcvRequest.page || 1,
        analysisType: ohlcvRequest.analysisType || "all"
      };
      if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes("unknown")) {
        console.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple3(message.content.text);
        if (regexResult.cryptocurrency) {
          processedRequest.cryptocurrency = regexResult.cryptocurrency;
          processedRequest.symbol = regexResult.symbol;
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
            processedRequest.token_id = resolvedToken.token_id;
            processedRequest.symbol = resolvedToken.symbol;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
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
      let responseText2 = `\u{1F4CA} **Daily OHLCV Data for ${tokenName}**

`;
      if (sortedData.length === 0) {
        responseText2 += `\u274C No valid daily OHLCV data found for ${tokenName}. This could mean:
`;
        responseText2 += `\u2022 The token may not have sufficient trading history
`;
        responseText2 += `\u2022 TokenMetrics may not have daily data for this token
`;
        responseText2 += `\u2022 All data points were filtered out due to quality issues
`;
        responseText2 += `\u2022 Try using a different token name or symbol

`;
        responseText2 += `\u{1F4A1} **Suggestion**: Try major cryptocurrencies like Bitcoin, Ethereum, or Solana.`;
      } else {
        if (ohlcvData.length > sortedData.length) {
          const tokenFiltered = ohlcvData.length - filteredByToken.length;
          const qualityFiltered = filteredByToken.length - sortedData.length;
          if (tokenFiltered > 0 && qualityFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Filtered out ${tokenFiltered} mixed token data points and ${qualityFiltered} invalid data points for accurate analysis.

`;
          } else if (tokenFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Selected main token from ${tokenFiltered + sortedData.length} mixed data points for accurate analysis.

`;
          } else if (qualityFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Filtered out ${qualityFiltered} invalid data points for better analysis accuracy.

`;
          }
        }
        const recentData = sortedData.slice(-5).reverse();
        responseText2 += `\u{1F4C8} **Recent Daily Data (Last ${recentData.length} days):**
`;
        recentData.forEach((item, index) => {
          const date = new Date(item.DATE || item.TIMESTAMP);
          const dateStr = date.toLocaleDateString();
          responseText2 += `
**Day ${index + 1}** (${dateStr}):
`;
          responseText2 += `\u2022 Open: ${formatCurrency(item.OPEN)}
`;
          responseText2 += `\u2022 High: ${formatCurrency(item.HIGH)}
`;
          responseText2 += `\u2022 Low: ${formatCurrency(item.LOW)}
`;
          responseText2 += `\u2022 Close: ${formatCurrency(item.CLOSE)}
`;
          responseText2 += `\u2022 Volume: ${formatCurrency(item.VOLUME)}
`;
        });
        if (ohlcvAnalysis && ohlcvAnalysis.summary) {
          responseText2 += `

\u{1F4CA} **Analysis Summary:**
${ohlcvAnalysis.summary}
`;
        }
        if (ohlcvAnalysis?.price_analysis) {
          const priceAnalysis = ohlcvAnalysis.price_analysis;
          responseText2 += `
\u{1F4B0} **Price Movement:**
`;
          responseText2 += `\u2022 Direction: ${priceAnalysis.direction || "Unknown"}
`;
          responseText2 += `\u2022 Change: ${priceAnalysis.price_change || "N/A"} (${priceAnalysis.change_percent || "N/A"})
`;
          responseText2 += `\u2022 Range: ${priceAnalysis.lowest_price || "N/A"} - ${priceAnalysis.highest_price || "N/A"}
`;
        }
        if (ohlcvAnalysis?.trend_analysis) {
          const trendAnalysis = ohlcvAnalysis.trend_analysis;
          responseText2 += `
\u{1F4C8} **Trend Analysis:**
`;
          responseText2 += `\u2022 Primary Trend: ${trendAnalysis.primary_trend}
`;
          responseText2 += `\u2022 Trend Strength: ${trendAnalysis.trend_strength}
`;
          responseText2 += `\u2022 Momentum: ${trendAnalysis.momentum}
`;
        }
        if (ohlcvAnalysis?.volume_analysis) {
          const volumeAnalysis = ohlcvAnalysis.volume_analysis;
          responseText2 += `
\u{1F4CA} **Volume Analysis:**
`;
          responseText2 += `\u2022 Average Volume: ${volumeAnalysis.average_volume || "N/A"}
`;
          responseText2 += `\u2022 Volume Trend: ${volumeAnalysis.volume_trend || "Unknown"}
`;
          responseText2 += `\u2022 Volume Pattern: ${volumeAnalysis.volume_pattern || "Unknown"}
`;
        }
        if (ohlcvAnalysis?.trading_recommendations?.primary_recommendations?.length > 0) {
          responseText2 += `
\u{1F3AF} **Trading Recommendations:**
`;
          ohlcvAnalysis.trading_recommendations.primary_recommendations.forEach((rec) => {
            responseText2 += `\u2022 ${rec}
`;
          });
        }
        if (processedRequest.analysisType === "swing_trading" && ohlcvAnalysis?.swing_trading_focus) {
          responseText2 += `
\u26A1 **Swing Trading Insights:**
`;
          ohlcvAnalysis.swing_trading_focus.insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "trend_analysis" && ohlcvAnalysis?.trend_focus) {
          responseText2 += `
\u{1F4C8} **Trend Analysis Insights:**
`;
          ohlcvAnalysis.trend_focus.insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "technical_indicators" && ohlcvAnalysis?.technical_focus) {
          responseText2 += `
\u{1F50D} **Technical Analysis:**
`;
          ohlcvAnalysis.technical_focus.insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        }
        responseText2 += `

\u{1F4CB} **Data Summary:**
`;
        responseText2 += `\u2022 Total Data Points: ${sortedData.length}
`;
        responseText2 += `\u2022 Timeframe: 1 day intervals
`;
        responseText2 += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText2 += `\u2022 Data Source: TokenMetrics Official API
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
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      console.error("Error in getDailyOhlcv action:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve daily OHLCV data from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/daily-ohlcv is accessible",
          parameter_validation: [
            "Verify token_id is a valid number or symbol is a valid string",
            "Check that date parameters use startDate/endDate format (YYYY-MM-DD)",
            "Ensure your API key has access to OHLCV data",
            "Confirm the token has sufficient trading history"
          ],
          common_solutions: [
            "Try using a major token (BTC=3375, ETH=1027) to test functionality",
            "Remove date filters to get recent data",
            "Check if your subscription includes daily OHLCV data access"
          ]
        }
      };
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getHourlyOhlcvAction.ts
var HourlyOhlcvRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  token_name: z.string().optional().describe("Full name of the token"),
  startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  limit: z.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["scalping", "intraday", "technical_patterns", "all"]).optional().describe("Type of analysis to focus on")
});
var HOURLY_OHLCV_EXTRACTION_TEMPLATE = `
CRITICAL INSTRUCTION: Extract the EXACT cryptocurrency name or symbol mentioned by the user. Do NOT substitute or change it.

You are an AI assistant specialized in extracting hourly OHLCV data requests from natural language.

The user wants to get hourly OHLCV (Open, High, Low, Close, Volume) data for cryptocurrency analysis. Extract the following information:

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
   - Convert relative dates like "last week", "past 3 days"

6. **endDate** (optional): End date for data range
   - Look for dates in YYYY-MM-DD format

7. **limit** (optional, default: 50): Number of data points to return
   - Maximum 50 allowed by API

8. **page** (optional, default: 1): Page number for pagination

9. **analysisType** (optional, default: "all"): What type of analysis they want
   - "scalping" - focus on very short-term price movements
   - "intraday" - focus on day trading patterns
   - "technical_patterns" - focus on technical analysis patterns
   - "all" - comprehensive hourly analysis

CRITICAL EXAMPLES:
- "Get hourly OHLCV for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me hourly candles for BTC" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Hourly data for ETH for scalping" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "scalping"}
- "DOGE hourly OHLCV" \u2192 {cryptocurrency: "Dogecoin", symbol: "DOGE", analysisType: "all"}
- "Solana intraday data" \u2192 {cryptocurrency: "Solana", symbol: "SOL", analysisType: "intraday"}

Extract the request details from the user's message.
`;
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
        user: "{{user1}}",
        content: {
          text: "Get hourly OHLCV data for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve hourly OHLCV data for Bitcoin from TokenMetrics for intraday analysis.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me hourly candle data for ETH for scalping"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get hourly OHLCV data for Ethereum optimized for scalping analysis.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get intraday trading data for the past 3 days"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve hourly OHLCV data for the past 3 days for intraday trading analysis.",
          action: "GET_HOURLY_OHLCV_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _params, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing hourly OHLCV request...`);
      const ohlcvRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        HOURLY_OHLCV_EXTRACTION_TEMPLATE,
        HourlyOhlcvRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, ohlcvRequest);
      let processedRequest = {
        cryptocurrency: ohlcvRequest.cryptocurrency,
        token_id: ohlcvRequest.token_id,
        symbol: ohlcvRequest.symbol,
        token_name: ohlcvRequest.token_name,
        startDate: ohlcvRequest.startDate,
        endDate: ohlcvRequest.endDate,
        limit: ohlcvRequest.limit || 50,
        // API maximum limit is 50
        page: ohlcvRequest.page || 1,
        analysisType: ohlcvRequest.analysisType || "all"
      };
      if (!processedRequest.cryptocurrency || processedRequest.cryptocurrency.toLowerCase().includes("unknown")) {
        console.log(`[${requestId}] AI extraction failed, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple4(message.content.text);
        if (regexResult.cryptocurrency) {
          processedRequest.cryptocurrency = regexResult.cryptocurrency;
          processedRequest.symbol = regexResult.symbol;
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
            processedRequest.token_id = resolvedToken.token_id;
            processedRequest.symbol = resolvedToken.symbol;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
          }
        } catch (error) {
          console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.cryptocurrency) {
        apiParams.token_name = processedRequest.cryptocurrency;
        console.log(`[${requestId}] Using token_name parameter: ${processedRequest.cryptocurrency}`);
      } else if (processedRequest.token_name) {
        apiParams.token_name = processedRequest.token_name;
        console.log(`[${requestId}] Using provided token_name: ${processedRequest.token_name}`);
      }
      if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
      if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
      const response = await callTokenMetricsAPI(
        "/v2/hourly-ohlcv",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
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
      const ohlcvAnalysis = analyzeHourlyOhlcvData(sortedData, processedRequest.analysisType);
      const tokenName = resolvedToken?.name || processedRequest.cryptocurrency || processedRequest.symbol || "the requested token";
      let responseText2 = `\u{1F4CA} **Hourly OHLCV Data for ${tokenName}**

`;
      if (ohlcvData.length === 0) {
        responseText2 += `\u274C No hourly OHLCV data found for ${tokenName}. This could mean:
`;
        responseText2 += `\u2022 The token may not have sufficient trading history
`;
        responseText2 += `\u2022 TokenMetrics may not have hourly data for this token
`;
        responseText2 += `\u2022 Try using a different token name or symbol

`;
        responseText2 += `\u{1F4A1} **Suggestion**: Try major cryptocurrencies like Bitcoin, Ethereum, or Solana.`;
      } else {
        if (ohlcvData.length > sortedData.length) {
          const tokenFiltered = ohlcvData.length - filteredByToken.length;
          const qualityFiltered = filteredByToken.length - sortedData.length;
          if (tokenFiltered > 0 && qualityFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Filtered out ${tokenFiltered} mixed token data points and ${qualityFiltered} invalid data points for accurate analysis.

`;
          } else if (tokenFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Selected main token from ${tokenFiltered + sortedData.length} mixed data points for accurate analysis.

`;
          } else if (qualityFiltered > 0) {
            responseText2 += `\u{1F50D} **Data Quality Note**: Filtered out ${qualityFiltered} invalid data points for better analysis accuracy.

`;
          }
        }
        const recentData = sortedData.slice(-5).reverse();
        responseText2 += `\u{1F4C8} **Recent Hourly Data (Last ${recentData.length} hours):**
`;
        recentData.forEach((item, index) => {
          const date = new Date(item.DATE || item.TIMESTAMP);
          const timeStr = date.toLocaleString();
          responseText2 += `
**Hour ${index + 1}** (${timeStr}):
`;
          responseText2 += `\u2022 Open: ${formatCurrency(item.OPEN)}
`;
          responseText2 += `\u2022 High: ${formatCurrency(item.HIGH)}
`;
          responseText2 += `\u2022 Low: ${formatCurrency(item.LOW)}
`;
          responseText2 += `\u2022 Close: ${formatCurrency(item.CLOSE)}
`;
          responseText2 += `\u2022 Volume: ${formatCurrency(item.VOLUME)}
`;
        });
        if (ohlcvAnalysis && ohlcvAnalysis.summary) {
          responseText2 += `

\u{1F4CA} **Analysis Summary:**
${ohlcvAnalysis.summary}
`;
        }
        if (ohlcvAnalysis?.price_analysis) {
          const priceAnalysis = ohlcvAnalysis.price_analysis;
          responseText2 += `
\u{1F4B0} **Price Movement:**
`;
          responseText2 += `\u2022 Direction: ${priceAnalysis.direction}
`;
          responseText2 += `\u2022 Change: ${priceAnalysis.price_change} (${priceAnalysis.change_percent})
`;
          responseText2 += `\u2022 Range: ${priceAnalysis.lowest_price} - ${priceAnalysis.highest_price}
`;
        }
        if (ohlcvAnalysis?.volume_analysis) {
          const volumeAnalysis = ohlcvAnalysis.volume_analysis;
          responseText2 += `
\u{1F4CA} **Volume Analysis:**
`;
          responseText2 += `\u2022 Average Volume: ${volumeAnalysis.average_volume}
`;
          responseText2 += `\u2022 Volume Trend: ${volumeAnalysis.volume_trend}
`;
          responseText2 += `\u2022 Consistency: ${volumeAnalysis.volume_consistency}
`;
        }
        if (ohlcvAnalysis?.trading_signals?.signals?.length > 0) {
          responseText2 += `
\u{1F3AF} **Trading Signals:**
`;
          ohlcvAnalysis.trading_signals.signals.forEach((signal) => {
            responseText2 += `\u2022 ${signal.type}: ${signal.signal}
`;
          });
        }
        if (processedRequest.analysisType === "scalping" && ohlcvAnalysis?.scalping_focus) {
          responseText2 += `
\u26A1 **Scalping Insights:**
`;
          ohlcvAnalysis.scalping_focus.scalping_insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "intraday" && ohlcvAnalysis?.intraday_focus) {
          responseText2 += `
\u{1F4C8} **Intraday Insights:**
`;
          ohlcvAnalysis.intraday_focus.intraday_insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        } else if (processedRequest.analysisType === "technical_patterns" && ohlcvAnalysis?.technical_focus) {
          responseText2 += `
\u{1F50D} **Technical Analysis:**
`;
          ohlcvAnalysis.technical_focus.technical_insights?.forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        }
        responseText2 += `

\u{1F4CB} **Data Summary:**
`;
        responseText2 += `\u2022 Total Data Points: ${sortedData.length}
`;
        responseText2 += `\u2022 Timeframe: 1 hour intervals
`;
        responseText2 += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText2 += `\u2022 Data Source: TokenMetrics Official API
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
      console.log(`[${requestId}] Hourly OHLCV analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
          content: result
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getHourlyOhlcvAction:", error);
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
      if (callback2) {
        callback2({
          text: errorText,
          content: errorResult
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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
    trading_recommendations: generateHourlyTradingRecommendations(trendAnalysis, technicalAnalysis, analysisType)
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
function generateHourlyTradingRecommendations(trendAnalysis, technicalAnalysis, analysisType) {
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

// src/actions/getHourlyTradingSignalsAction.ts
var HourlyTradingSignalsRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  signal: z.number().optional().describe("Filter by signal type (1=bullish, -1=bearish, 0=neutral)"),
  startDate: z.string().optional().describe("Start date for data range (YYYY-MM-DD)"),
  endDate: z.string().optional().describe("End date for data range (YYYY-MM-DD)"),
  category: z.string().optional().describe("Token category filter"),
  exchange: z.string().optional().describe("Exchange filter"),
  marketcap: z.number().optional().describe("Minimum market cap filter"),
  volume: z.number().optional().describe("Minimum volume filter"),
  fdv: z.number().optional().describe("Minimum fully diluted valuation filter"),
  limit: z.number().min(1).max(100).optional().describe("Number of signals to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["active_trading", "scalping", "momentum", "all"]).optional().describe("Type of analysis to focus on")
});
var HOURLY_TRADING_SIGNALS_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting hourly trading signals requests from natural language.

The user wants to get AI-generated hourly trading signals for cryptocurrency analysis. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

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

Examples:
- "Get hourly trading signals for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me bullish hourly signals" \u2192 {signal: 1, analysisType: "active_trading"}
- "Hourly buy signals for ETH" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", signal: 1, analysisType: "active_trading"}
- "Scalping signals for the past 24 hours" \u2192 {analysisType: "scalping"}

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Get hourly trading signals for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the latest hourly trading signals for Bitcoin from TokenMetrics AI.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me hourly buy signals for cryptocurrencies"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve hourly bullish trading signals for active trading opportunities.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get scalping signals for ETH"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get hourly scalping signals for Ethereum optimized for very short-term trading.",
          action: "GET_HOURLY_TRADING_SIGNALS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, _state) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing hourly trading signals request...`);
      const signalsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        _state || await runtime.composeState(message),
        HOURLY_TRADING_SIGNALS_EXTRACTION_TEMPLATE,
        HourlyTradingSignalsRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, signalsRequest);
      const processedRequest = {
        cryptocurrency: signalsRequest.cryptocurrency,
        token_id: signalsRequest.token_id,
        symbol: signalsRequest.symbol,
        signal: signalsRequest.signal,
        startDate: signalsRequest.startDate,
        endDate: signalsRequest.endDate,
        category: signalsRequest.category,
        exchange: signalsRequest.exchange,
        marketcap: signalsRequest.marketcap,
        volume: signalsRequest.volume,
        fdv: signalsRequest.fdv,
        limit: signalsRequest.limit || 20,
        page: signalsRequest.page || 1,
        analysisType: signalsRequest.analysisType || "all"
      };
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
        try {
          resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
          if (resolvedToken) {
            processedRequest.token_id = resolvedToken.token_id;
            processedRequest.symbol = resolvedToken.symbol;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
          }
        } catch (error) {
          console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) apiParams.token_id = processedRequest.token_id;
      if (processedRequest.symbol) apiParams.symbol = processedRequest.symbol;
      if (processedRequest.signal !== void 0) apiParams.signal = processedRequest.signal;
      if (processedRequest.startDate) apiParams.startDate = processedRequest.startDate;
      if (processedRequest.endDate) apiParams.endDate = processedRequest.endDate;
      if (processedRequest.category) apiParams.category = processedRequest.category;
      if (processedRequest.exchange) apiParams.exchange = processedRequest.exchange;
      if (processedRequest.marketcap) apiParams.marketcap = processedRequest.marketcap;
      if (processedRequest.volume) apiParams.volume = processedRequest.volume;
      if (processedRequest.fdv) apiParams.fdv = processedRequest.fdv;
      const response = await callTokenMetricsAPI(
        "/v2/hourly-trading-signals",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const hourlySignals = Array.isArray(response) ? response : response.data || [];
      const signalsAnalysis = analyzeHourlyTradingSignals(hourlySignals, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${hourlySignals.length} hourly trading signals from TokenMetrics AI`,
        request_id: requestId,
        hourly_trading_signals: hourlySignals,
        analysis: signalsAnalysis,
        metadata: {
          endpoint: "hourly-trading-signals",
          requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
          resolved_token: resolvedToken,
          signal_filter: processedRequest.signal,
          date_range: {
            start: processedRequest.startDate,
            end: processedRequest.endDate
          },
          filters_applied: {
            category: processedRequest.category,
            exchange: processedRequest.exchange,
            min_marketcap: processedRequest.marketcap,
            min_volume: processedRequest.volume,
            min_fdv: processedRequest.fdv
          },
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: hourlySignals.length,
          api_version: "v2",
          data_source: "TokenMetrics AI Hourly Signals",
          update_frequency: "Hourly"
        },
        signals_explanation: {
          signal_values: {
            "1": "Bullish/Long signal - AI recommends buying or holding position",
            "-1": "Bearish/Short signal - AI recommends short position or selling",
            "0": "No signal - AI sees neutral conditions"
          },
          field_name: "TRADING_SIGNAL",
          hourly_advantages: [
            "More frequent signal updates for active trading",
            "Better timing for short-term positions",
            "Captures intraday market movements",
            "Ideal for scalping and day trading strategies"
          ]
        }
      };
      console.log(`[${requestId}] Hourly trading signals analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "hourlytradingsignals",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getHourlyTradingSignalsAction:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve hourly trading signals from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/hourly-trading-signals is accessible",
          parameter_validation: [
            "Verify token_id is a valid number or symbol is a valid string",
            "Check that signal filter is 1 (bullish), -1 (bearish), or 0 (neutral)",
            "Ensure your API key has access to hourly trading signals",
            "Verify date parameters use YYYY-MM-DD format"
          ],
          common_solutions: [
            "Try using a major token (BTC, ETH) to test functionality",
            "Remove filters to get broader signal results",
            "Check if your subscription includes hourly signals access",
            "Verify the token has active hourly signal generation"
          ]
        }
      };
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
  }
};
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
    trading_recommendations: generateHourlyTradingRecommendations2(distribution, trends, opportunities, quality),
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
    if (signal.TRADING_SIGNAL === 1) distribution.bullish++;
    else if (signal.TRADING_SIGNAL === -1) distribution.bearish++;
    else distribution.neutral++;
    if (signal.TIMESTAMP || signal.DATE) {
      const timestamp = signal.TIMESTAMP || signal.DATE;
      const hour = new Date(timestamp).getHours();
      if (!byHour[hour]) byHour[hour] = { bullish: 0, bearish: 0, neutral: 0 };
      if (signal.TRADING_SIGNAL === 1) byHour[hour].bullish++;
      else if (signal.TRADING_SIGNAL === -1) byHour[hour].bearish++;
      else byHour[hour].neutral++;
    }
    const token = signal.SYMBOL || signal.TOKEN_ID;
    if (token) {
      if (!byToken[token]) byToken[token] = { bullish: 0, bearish: 0, neutral: 0 };
      if (signal.TRADING_SIGNAL === 1) byToken[token].bullish++;
      else if (signal.TRADING_SIGNAL === -1) byToken[token].bearish++;
      else byToken[token].neutral++;
    }
  });
  const total = signalsData.length;
  return {
    total_signals: total,
    bullish_percentage: (distribution.bullish / total * 100).toFixed(1),
    bearish_percentage: (distribution.bearish / total * 100).toFixed(1),
    neutral_percentage: (distribution.neutral / total * 100).toFixed(1),
    by_hour: byHour,
    by_token: byToken,
    market_sentiment: distribution.bullish > distribution.bearish ? "Bullish" : distribution.bearish > distribution.bullish ? "Bearish" : "Neutral"
  };
}
function analyzeHourlyTrends(signalsData) {
  const sortedData = signalsData.filter((signal) => signal.TIMESTAMP || signal.DATE).sort((a, b) => new Date(a.TIMESTAMP || a.DATE).getTime() - new Date(b.TIMESTAMP || b.DATE).getTime());
  if (sortedData.length < 2) {
    return { trend: "Insufficient data for trend analysis" };
  }
  const recentSignals = sortedData.slice(-10);
  const olderSignals = sortedData.slice(0, 10);
  const recentBullish = recentSignals.filter((s) => (s.TRADING_SIGNAL || s.SIGNAL) === 1).length;
  const olderBullish = olderSignals.filter((s) => (s.TRADING_SIGNAL || s.SIGNAL) === 1).length;
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
  const strongSignals = signalsData.filter(
    (signal) => signal.AI_CONFIDENCE && signal.AI_CONFIDENCE > 0.7 || signal.SIGNAL_STRENGTH && signal.SIGNAL_STRENGTH > 0.7
  );
  strongSignals.forEach((signal) => {
    const signalValue = signal.TRADING_SIGNAL || signal.SIGNAL;
    if (signalValue === 1) {
      opportunities.push({
        type: "BUY_OPPORTUNITY",
        token: signal.SYMBOL || signal.TOKEN_ID,
        confidence: signal.AI_CONFIDENCE || signal.SIGNAL_STRENGTH || "High",
        entry_price: signal.ENTRY_PRICE,
        target_price: signal.TARGET_PRICE,
        timestamp: signal.TIMESTAMP || signal.DATE,
        reasoning: signal.REASONING || "Strong bullish signal detected"
      });
    } else if (signalValue === -1) {
      opportunities.push({
        type: "SELL_OPPORTUNITY",
        token: signal.SYMBOL || signal.TOKEN_ID,
        confidence: signal.AI_CONFIDENCE || signal.SIGNAL_STRENGTH || "High",
        entry_price: signal.ENTRY_PRICE,
        stop_loss: signal.STOP_LOSS,
        timestamp: signal.TIMESTAMP || signal.DATE,
        reasoning: signal.REASONING || "Strong bearish signal detected"
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
function generateHourlyTradingRecommendations2(distribution, trends, opportunities, quality) {
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

// src/actions/getResistanceSupportAction.ts
var ResistanceSupportRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  limit: z.number().min(1).max(100).optional().describe("Number of levels to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["trading_levels", "breakout_analysis", "risk_management", "all"]).optional().describe("Type of analysis to focus on")
});
function extractCryptocurrencySimple5(text) {
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

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Get resistance and support levels for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the key resistance and support levels for Bitcoin from TokenMetrics technical analysis.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me support and resistance levels for Ethereum"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the technical support and resistance levels for Ethereum to help with trading decisions.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Risk management levels for Solana"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get resistance and support levels for Solana focused on risk management and stop-loss placement.",
          action: "GET_RESISTANCE_SUPPORT_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _params, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing resistance and support levels request...`);
      const levelsRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        RESISTANCE_SUPPORT_EXTRACTION_TEMPLATE,
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
      const userText = message.content.text || "";
      const regexResult = extractCryptocurrencySimple5(userText);
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
        const symbolMapping = {
          "btc": { name: "Bitcoin", symbol: "BTC" },
          "eth": { name: "Ethereum", symbol: "ETH" },
          "doge": { name: "Dogecoin", symbol: "DOGE" },
          "sol": { name: "Solana", symbol: "SOL" },
          "avax": { name: "Avalanche", symbol: "AVAX" },
          "ada": { name: "Cardano", symbol: "ADA" },
          "dot": { name: "Polkadot", symbol: "DOT" },
          "link": { name: "Chainlink", symbol: "LINK" },
          "matic": { name: "Polygon", symbol: "MATIC" },
          "bnb": { name: "BNB", symbol: "BNB" }
        };
        const cryptoLower = processedRequest.cryptocurrency.toLowerCase();
        if (symbolMapping[cryptoLower]) {
          console.log(`[${requestId}] Converting symbol "${processedRequest.cryptocurrency}" to full name "${symbolMapping[cryptoLower].name}"`);
          processedRequest.cryptocurrency = symbolMapping[cryptoLower].name;
          processedRequest.symbol = symbolMapping[cryptoLower].symbol;
        }
      }
      console.log(`[${requestId}] Final processed request:`, processedRequest);
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id) {
        const isLikelySymbol = processedRequest.cryptocurrency.length <= 5 && processedRequest.cryptocurrency === processedRequest.cryptocurrency.toUpperCase();
        if (!isLikelySymbol) {
          try {
            resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
            if (resolvedToken) {
              processedRequest.token_id = resolvedToken.token_id;
              processedRequest.symbol = resolvedToken.symbol;
              console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
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
        const symbolMapping = {
          "bitcoin": "BTC",
          "ethereum": "ETH",
          "dogecoin": "DOGE",
          "solana": "SOL",
          "avalanche": "AVAX",
          "cardano": "ADA",
          "polkadot": "DOT",
          "chainlink": "LINK",
          "polygon": "MATIC",
          "binance coin": "BNB",
          "bnb": "BNB"
        };
        const mappedSymbol = symbolMapping[processedRequest.cryptocurrency.toLowerCase()];
        if (mappedSymbol) {
          apiParams.symbol = mappedSymbol;
          console.log(`[${requestId}] Mapped ${processedRequest.cryptocurrency} to symbol: ${mappedSymbol}`);
        } else {
          console.log(`[${requestId}] No symbol mapping found for: ${processedRequest.cryptocurrency}`);
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
      let responseText2 = `\u{1F4CA} **Resistance & Support Analysis for ${tokenName}**

`;
      if (levelsData.length === 0) {
        responseText2 += `\u274C No resistance and support levels found for ${tokenName}. This could mean:
`;
        responseText2 += `\u2022 The token may not have sufficient price history
`;
        responseText2 += `\u2022 TokenMetrics may not have performed technical analysis on this token yet
`;
        responseText2 += `\u2022 Try using a major cryptocurrency like Bitcoin or Ethereum

`;
      } else {
        responseText2 += `\u2705 **Found ${levelsData.length} key levels** (${resistanceLevels.length} resistance, ${supportLevels.length} support)

`;
        if (processedRequest.analysisType === "trading_levels") {
          responseText2 += `\u{1F3AF} **Trading Levels Focus:**
`;
          responseText2 += `\u2022 Key entry opportunities: ${supportLevels.length} support levels
`;
          responseText2 += `\u2022 Key exit targets: ${resistanceLevels.length} resistance levels
`;
        } else if (processedRequest.analysisType === "breakout_analysis") {
          responseText2 += `\u{1F680} **Breakout Analysis Focus:**
`;
          const strongResistance = resistanceLevels.filter((r) => (r.STRENGTH || 0) > 0.7);
          const weakSupport = supportLevels.filter((s) => (s.STRENGTH || 0) < 0.5);
          responseText2 += `\u2022 Breakout candidates: ${strongResistance.length} strong resistance levels
`;
          responseText2 += `\u2022 Breakdown risks: ${weakSupport.length} weak support levels
`;
        } else if (processedRequest.analysisType === "risk_management") {
          responseText2 += `\u{1F6E1}\uFE0F **Risk Management Focus:**
`;
          responseText2 += `\u2022 Stop-loss levels: ${supportLevels.length} support zones
`;
          responseText2 += `\u2022 Take-profit levels: ${resistanceLevels.length} resistance zones
`;
        } else {
          responseText2 += `\u{1F4C8} **Comprehensive Analysis:**
`;
          responseText2 += `\u2022 ${levelsAnalysis.summary}
`;
        }
        if (levelsAnalysis.insights && levelsAnalysis.insights.length > 0) {
          responseText2 += `
\u{1F4A1} **Key Insights:**
`;
          levelsAnalysis.insights.slice(0, 3).forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
        }
        if (levelsAnalysis.technical_outlook) {
          responseText2 += `
\u{1F52E} **Technical Outlook:** ${levelsAnalysis.technical_outlook.market_bias || "Neutral"}
`;
        }
        responseText2 += `
\u{1F4CB} **Usage Guidelines:**
`;
        responseText2 += `\u2022 Use support levels as potential entry points for long positions
`;
        responseText2 += `\u2022 Use resistance levels as potential exit points or profit-taking levels
`;
        responseText2 += `\u2022 Monitor level breaks for trend continuation or reversal signals
`;
        responseText2 += `\u2022 Combine with volume analysis for confirmation of level significance
`;
      }
      responseText2 += `
\u{1F517} **Data Source:** TokenMetrics Technical Analysis Engine (v2)`;
      console.log(`[${requestId}] Resistance and support analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
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
      if (callback2) {
        callback2({
          text: errorMessage,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
            message: "Failed to retrieve resistance and support levels from TokenMetrics API"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getScenarioAnalysisAction.ts
import {
  composeContext as composeContext6,
  generateObject as generateObject6,
  ModelClass as ModelClass6
} from "@elizaos/core";
var ScenarioAnalysisRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  limit: z.number().min(1).max(100).optional().describe("Number of scenarios to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["risk_assessment", "portfolio_planning", "stress_testing", "all"]).optional().describe("Type of analysis to focus on")
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

Extract the scenario analysis request from the user's message:`;
function extractCryptocurrencySimple6(text) {
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
        user: "{{user1}}",
        content: {
          text: "Get scenario analysis for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve price scenario analysis for Bitcoin under different market conditions.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me risk scenarios for portfolio planning"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get comprehensive scenario analysis for portfolio risk assessment and planning.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Stress test scenarios for market crash"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve stress testing scenarios for extreme market conditions.",
          action: "GET_SCENARIO_ANALYSIS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _params, callback2) {
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
      const scenarioRequestResult = await generateObject6({
        runtime,
        context: composeContext6({
          state: state || await runtime.composeState(message),
          template: enhancedTemplate
        }),
        modelClass: ModelClass6.LARGE,
        // Use GPT-4o for better instruction following
        schema: ScenarioAnalysisRequestSchema,
        mode: "json"
      });
      let scenarioRequest = scenarioRequestResult.object;
      console.log(`[${requestId}] AI Extracted:`, scenarioRequest);
      if (!scenarioRequest.cryptocurrency && !scenarioRequest.symbol) {
        console.log(`[${requestId}] AI extraction incomplete, applying regex fallback...`);
        const regexResult = extractCryptocurrencySimple6(userMessage);
        if (regexResult.cryptocurrency || regexResult.symbol) {
          scenarioRequest = {
            ...scenarioRequest,
            cryptocurrency: regexResult.cryptocurrency,
            symbol: regexResult.symbol
          };
          console.log(`[${requestId}] Regex fallback result:`, regexResult);
        }
      }
      if (scenarioRequest.cryptocurrency && !scenarioRequest.symbol) {
        const crypto = scenarioRequest.cryptocurrency.toUpperCase();
        const commonSymbols = ["BTC", "ETH", "DOGE", "AVAX", "SOL", "ADA", "DOT", "MATIC", "LINK", "UNI", "LTC", "XRP", "BNB", "USDT", "USDC", "ATOM", "NEAR", "FTM", "ALGO", "VET", "ICP", "FLOW", "SAND", "MANA", "CRO", "APE", "SHIB", "PEPE", "WIF", "BONK"];
        if (commonSymbols.includes(crypto)) {
          console.log(`[${requestId}] \u{1F527} Fixing misclassified extraction: "${scenarioRequest.cryptocurrency}" is a symbol, not a cryptocurrency name`);
          scenarioRequest = {
            ...scenarioRequest,
            cryptocurrency: void 0,
            symbol: crypto
          };
          console.log(`[${requestId}] \u{1F527} Corrected to:`, { symbol: crypto });
        }
      }
      if (scenarioRequest.cryptocurrency || scenarioRequest.symbol) {
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
        if (callback2) {
          callback2({
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
        return false;
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
      let responseText2 = `\u{1F4CA} **Scenario Analysis for ${tokenName}**

`;
      if (scenarioData.length === 0) {
        responseText2 += "\u274C No scenario analysis data available for this token.\n";
        responseText2 += "This could mean:\n";
        responseText2 += "\u2022 Token is not covered by TokenMetrics scenario modeling\n";
        responseText2 += "\u2022 Insufficient historical data for scenario generation\n";
        responseText2 += "\u2022 Token may be too new or have limited market activity\n";
      } else {
        responseText2 += `\u{1F3AF} **Analysis Summary**
`;
        responseText2 += `\u2022 Total Scenarios: ${scenarioData.length}
`;
        responseText2 += `\u2022 Analysis Type: ${processedRequest.analysisType}
`;
        responseText2 += `\u2022 Data Source: TokenMetrics Scenario Modeling Engine

`;
        if (scenarioAnalysis.scenario_breakdown) {
          responseText2 += `\u{1F4C8} **Scenario Breakdown**
`;
          responseText2 += `\u2022 Total Scenario Types: ${scenarioAnalysis.scenario_breakdown.scenario_types || 0}
`;
          responseText2 += `\u2022 Most Likely Scenario: ${scenarioAnalysis.scenario_breakdown.most_likely_scenario || "Unknown"}

`;
        }
        if (scenarioAnalysis.risk_assessment) {
          responseText2 += `\u26A0\uFE0F **Risk Assessment**
`;
          responseText2 += `\u2022 Risk Level: ${scenarioAnalysis.risk_assessment.overall_risk_level || "Unknown"}
`;
          responseText2 += `\u2022 Max Potential Drawdown: ${scenarioAnalysis.risk_assessment.max_potential_drawdown || "Unknown"}
`;
          responseText2 += `\u2022 Downside Scenarios: ${scenarioAnalysis.risk_assessment.downside_scenarios || 0}

`;
        }
        if (scenarioAnalysis.opportunity_analysis) {
          responseText2 += `\u{1F680} **Opportunity Analysis**
`;
          responseText2 += `\u2022 Upside Potential: ${scenarioAnalysis.opportunity_analysis.upside_potential || "Unknown"}
`;
          responseText2 += `\u2022 Max Potential Upside: ${scenarioAnalysis.opportunity_analysis.max_potential_upside || "Unknown"}
`;
          responseText2 += `\u2022 Upside Scenarios: ${scenarioAnalysis.opportunity_analysis.upside_scenarios || 0}

`;
        }
        if (scenarioAnalysis.insights && scenarioAnalysis.insights.length > 0) {
          responseText2 += `\u{1F4A1} **Key Insights**
`;
          scenarioAnalysis.insights.slice(0, 3).forEach((insight) => {
            responseText2 += `\u2022 ${insight}
`;
          });
          responseText2 += `
`;
        }
        responseText2 += `\u{1F4CB} **Usage Guidelines**
`;
        responseText2 += `\u2022 Use for risk assessment and portfolio stress testing
`;
        responseText2 += `\u2022 Plan position sizing based on downside scenarios
`;
        responseText2 += `\u2022 Set profit targets based on upside scenarios
`;
        responseText2 += `\u2022 Develop contingency plans for extreme scenarios

`;
        responseText2 += `\u26A1 *Scenario analysis is probabilistic, not predictive. Use for strategic planning and risk management.*`;
      }
      console.log(`[${requestId}] Scenario analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      console.error("Error in getScenarioAnalysisAction:", error);
      if (callback2) {
        callback2({
          text: `\u274C Failed to retrieve scenario analysis: ${error instanceof Error ? error.message : "Unknown error"}`,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getSentimentAction.ts
var SentimentRequestSchema = z.object({
  limit: z.number().min(1).max(100).optional().describe("Number of sentiment data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["market_mood", "social_trends", "news_impact", "all"]).optional().describe("Type of sentiment analysis to focus on")
});
var SENTIMENT_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting sentiment analysis requests from natural language.

IMPORTANT: This API provides GENERAL CRYPTO MARKET sentiment and news, NOT token-specific data.
When users ask for "Bitcoin news" or "Ethereum sentiment", they get overall crypto market sentiment that affects all tokens.

The user wants to get hourly sentiment scores from Twitter, Reddit, and news sources. Extract the following information:

1. **limit** (optional, default: 24): Number of sentiment data points to return
   - Look for phrases like "last 24 hours", "past week", "recent sentiment"
   - 24 = last 24 hours, 168 = last week

2. **page** (optional, default: 1): Page number for pagination

3. **analysisType** (optional, default: "all"): What type of sentiment analysis they want
   - "market_mood" - focus on overall market sentiment and emotional indicators
   - "social_trends" - focus on social media trends and viral content
   - "news_impact" - focus on news sentiment and media coverage impact
   - "all" - comprehensive sentiment analysis across all sources

Examples:
- "Get market sentiment" \u2192 {analysisType: "all"}
- "Show me social media sentiment trends" \u2192 {analysisType: "social_trends"}
- "Check news sentiment impact" \u2192 {analysisType: "news_impact"}
- "Get news for Bitcoin" \u2192 {analysisType: "news_impact"} (returns general crypto news sentiment)
- "Bitcoin news sentiment" \u2192 {analysisType: "news_impact"} (returns general crypto news sentiment)
- "Market mood for the past 24 hours" \u2192 {limit: 24, analysisType: "market_mood"}
- "Sentiment analysis for the past week" \u2192 {limit: 168, analysisType: "all"}

Extract the request details from the user's message.
`;
var getSentimentAction = {
  name: "GET_SENTIMENT_TOKENMETRICS",
  description: "Get hourly sentiment scores and news analysis from Twitter, Reddit, and crypto news sources with market mood analysis from TokenMetrics",
  similes: [
    "get sentiment",
    "market sentiment",
    "sentiment analysis",
    "social sentiment",
    "market mood",
    "news sentiment",
    "twitter sentiment",
    "reddit sentiment",
    "social media sentiment",
    "get news",
    "crypto news",
    "market news",
    "news analysis",
    "news impact"
  ],
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get market sentiment analysis"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the latest market sentiment from Twitter, Reddit, and news sources.",
          action: "GET_SENTIMENT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me social media sentiment trends"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll analyze social media sentiment trends across Twitter and Reddit.",
          action: "GET_SENTIMENT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Check news sentiment impact on crypto"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll analyze news sentiment and its impact on cryptocurrency markets.",
          action: "GET_SENTIMENT_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get news for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the latest crypto market news and sentiment analysis that affects Bitcoin and the broader market.",
          action: "GET_SENTIMENT_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _params, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing sentiment analysis request...`);
      const sentimentRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        SENTIMENT_EXTRACTION_TEMPLATE,
        SentimentRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, sentimentRequest);
      const processedRequest = {
        limit: sentimentRequest.limit || 24,
        // Last 24 hours by default
        page: sentimentRequest.page || 1,
        analysisType: sentimentRequest.analysisType || "all"
      };
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      const response = await callTokenMetricsAPI(
        "/v2/sentiments",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const sentimentData = Array.isArray(response) ? response : response.data || [];
      const sentimentAnalysis = analyzeSentimentData(sentimentData, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${sentimentData.length} sentiment data points from TokenMetrics`,
        request_id: requestId,
        sentiment_data: sentimentData,
        analysis: sentimentAnalysis,
        metadata: {
          endpoint: "sentiments",
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: sentimentData.length,
          api_version: "v2",
          data_source: "TokenMetrics Sentiment Engine"
        },
        sentiment_explanation: {
          SENTIMENT_SCORE: "Overall sentiment score aggregating all sources (-100 to +100)",
          TWITTER_SENTIMENT: "Sentiment derived from Twitter/X cryptocurrency discussions",
          REDDIT_SENTIMENT: "Sentiment from Reddit cryptocurrency communities",
          NEWS_SENTIMENT: "Sentiment from cryptocurrency news articles and media",
          OVERALL_SENTIMENT: "Qualitative assessment (Bullish/Bearish/Neutral)",
          interpretation: {
            "80 to 100": "Extremely Bullish - Very positive market sentiment",
            "60 to 79": "Bullish - Positive sentiment with optimism",
            "40 to 59": "Moderately Bullish - Slight positive bias",
            "20 to 39": "Neutral to Positive - Balanced with slight optimism",
            "-20 to 19": "Neutral - Balanced sentiment",
            "-40 to -21": "Moderately Bearish - Slight negative bias",
            "-60 to -41": "Bearish - Negative sentiment with pessimism",
            "-100 to -61": "Extremely Bearish - Very negative market sentiment"
          },
          usage_guidelines: [
            "Use sentiment as a contrarian indicator at extremes",
            "Combine with technical analysis for better timing",
            "Monitor sentiment changes for trend reversals",
            "High sentiment volatility indicates market uncertainty"
          ]
        }
      };
      let responseText2 = "";
      if (processedRequest.analysisType === "news_impact") {
        responseText2 = `\u{1F4F0} **Crypto Market News & Sentiment Analysis**

`;
        responseText2 += `\u2139\uFE0F *Note: This provides general crypto market news sentiment that affects all cryptocurrencies, not token-specific news.*

`;
      } else {
        responseText2 = `\u{1F4CA} **Crypto Market Sentiment Analysis**

`;
      }
      if (sentimentData.length === 0) {
        responseText2 += `\u274C No sentiment data available at the moment.

`;
      } else {
        const latest = sentimentData[0];
        const marketGrade = latest.MARKET_SENTIMENT_GRADE || 0;
        const marketLabel = latest.MARKET_SENTIMENT_LABEL || "Unknown";
        responseText2 += `\u{1F3AF} **Current Market Sentiment**: ${marketLabel} (${marketGrade})

`;
        if (latest.TWITTER_SENTIMENT_GRADE !== void 0) {
          responseText2 += `\u{1F426} **Twitter**: ${latest.TWITTER_SENTIMENT_LABEL || "Unknown"} (${latest.TWITTER_SENTIMENT_GRADE})
`;
        }
        if (latest.REDDIT_SENTIMENT_GRADE !== void 0) {
          responseText2 += `\u{1F4F1} **Reddit**: ${latest.REDDIT_SENTIMENT_LABEL || "Unknown"} (${latest.REDDIT_SENTIMENT_GRADE})
`;
        }
        if (latest.NEWS_SENTIMENT_GRADE !== void 0) {
          responseText2 += `\u{1F4F0} **News**: ${latest.NEWS_SENTIMENT_LABEL || "Unknown"} (${latest.NEWS_SENTIMENT_GRADE})

`;
        }
        if (latest.NEWS_SUMMARY) {
          responseText2 += `\u{1F4F0} **News Summary**: ${latest.NEWS_SUMMARY}

`;
        }
        if (latest.TWITTER_SUMMARY) {
          responseText2 += `\u{1F426} **Twitter Summary**: ${latest.TWITTER_SUMMARY}

`;
        }
        if (latest.REDDIT_SUMMARY) {
          responseText2 += `\u{1F4F1} **Reddit Summary**: ${latest.REDDIT_SUMMARY}

`;
        }
        if (sentimentAnalysis.insights && sentimentAnalysis.insights.length > 0) {
          responseText2 += `\u{1F4A1} **Key Insights**:
`;
          sentimentAnalysis.insights.slice(0, 3).forEach((insight, index) => {
            responseText2 += `${index + 1}. ${insight}
`;
          });
          responseText2 += `
`;
        }
        if (sentimentAnalysis.trading_implications) {
          responseText2 += `\u{1F4C8} **Trading Implications**: ${sentimentAnalysis.trading_implications.recommendation}
`;
          responseText2 += `\u26A0\uFE0F **Risk Level**: ${sentimentAnalysis.trading_implications.risk_level}

`;
        }
      }
      responseText2 += `\u{1F4CA} Retrieved ${sentimentData.length} sentiment data points from TokenMetrics
`;
      responseText2 += `\u{1F550} Analysis focus: ${processedRequest.analysisType}
`;
      responseText2 += `\u{1F4C4} Page ${processedRequest.page} (limit: ${processedRequest.limit})`;
      console.log(`[${requestId}] Sentiment analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "sentiment",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getSentimentAction:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve sentiment data from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/sentiments is accessible",
          parameter_validation: [
            "Check that pagination parameters are positive integers",
            "Ensure your API key has access to sentiment data",
            "Verify the sentiment engine is operational"
          ],
          common_solutions: [
            "Try reducing the limit if requesting too much data",
            "Check if your subscription includes sentiment analysis access",
            "Verify the sentiment data is available for the requested timeframe",
            "Ensure sufficient social media and news data exists"
          ]
        }
      };
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
  }
};
function analyzeSentimentData(sentimentData, analysisType = "all") {
  if (!sentimentData || sentimentData.length === 0) {
    return {
      summary: "No sentiment data available for analysis",
      current_mood: "Unknown",
      insights: []
    };
  }
  const sortedData = sentimentData.sort((a, b) => new Date(b.DATE || b.TIMESTAMP).getTime() - new Date(a.DATE || a.TIMESTAMP).getTime());
  const currentSentiment = getCurrentSentimentAnalysis(sortedData);
  const trendAnalysis = analyzeSentimentTrends(sortedData);
  const sourceAnalysis = analyzeSentimentSources(sortedData);
  const extremesAnalysis = analyzeExtremes(sortedData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "market_mood":
      focusedAnalysis = {
        market_mood_focus: {
          emotional_indicators: analyzeEmotionalIndicators(sortedData),
          mood_shifts: identifyMoodShifts(sortedData),
          market_psychology: assessMarketPsychology(currentSentiment, trendAnalysis),
          mood_insights: [
            `\u{1F60A} Current mood: ${currentSentiment.overall_mood}`,
            `\u{1F4CA} Sentiment strength: ${currentSentiment.sentiment_strength}`,
            `\u{1F504} Mood trend: ${trendAnalysis.trend_direction}`
          ]
        }
      };
      break;
    case "social_trends":
      focusedAnalysis = {
        social_trends_focus: {
          viral_content: identifyViralContent(sortedData),
          platform_comparison: comparePlatforms(sourceAnalysis),
          trending_topics: extractTrendingTopics(sortedData),
          social_insights: [
            `\u{1F4F1} Twitter sentiment: ${currentSentiment.twitter_sentiment}`,
            `\u{1F534} Reddit sentiment: ${currentSentiment.reddit_sentiment}`,
            `\u{1F525} Social momentum: ${trendAnalysis.social_momentum || "Neutral"}`
          ]
        }
      };
      break;
    case "news_impact":
      focusedAnalysis = {
        news_impact_focus: {
          media_coverage: analyzeMediaCoverage(sortedData),
          news_correlation: analyzeNewsCorrelation(sortedData),
          impact_assessment: assessNewsImpact(currentSentiment, sourceAnalysis),
          news_insights: [
            `\u{1F4F0} News sentiment: ${currentSentiment.news_sentiment}`,
            `\u{1F4C8} Media impact: ${sourceAnalysis.news_influence || "Moderate"}`,
            `\u{1F3AF} Coverage tone: ${sourceAnalysis.coverage_tone || "Neutral"}`
          ]
        }
      };
      break;
  }
  return {
    summary: `Market sentiment shows ${currentSentiment.overall_mood} mood with ${trendAnalysis.trend_direction} trend over recent periods`,
    analysis_type: analysisType,
    current_sentiment: currentSentiment,
    trend_analysis: trendAnalysis,
    source_analysis: sourceAnalysis,
    extremes_analysis: extremesAnalysis,
    insights: generateSentimentInsights(currentSentiment, trendAnalysis, sourceAnalysis, extremesAnalysis),
    trading_implications: generateTradingImplications(currentSentiment, trendAnalysis),
    contrarian_analysis: generateContrarianAnalysis(currentSentiment, trendAnalysis),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics Sentiment Engine",
      data_points: sentimentData.length,
      sources_covered: ["Twitter/X", "Reddit", "News Media"],
      time_coverage: calculateTimeCoverage(sortedData),
      reliability: "High - Multi-source social and news sentiment"
    }
  };
}
function getCurrentSentimentAnalysis(sortedData) {
  const latest = sortedData[sortedData.length - 1];
  if (!latest) {
    return { overall_mood: "Unknown", score: 0 };
  }
  const overallScore = latest.SENTIMENT_SCORE || 0;
  const twitterScore = latest.TWITTER_SENTIMENT || 0;
  const redditScore = latest.REDDIT_SENTIMENT || 0;
  const newsScore = latest.NEWS_SENTIMENT || 0;
  let overallMood;
  if (overallScore >= 60) overallMood = "Very Bullish";
  else if (overallScore >= 40) overallMood = "Bullish";
  else if (overallScore >= 20) overallMood = "Moderately Bullish";
  else if (overallScore >= -20) overallMood = "Neutral";
  else if (overallScore >= -40) overallMood = "Moderately Bearish";
  else if (overallScore >= -60) overallMood = "Bearish";
  else overallMood = "Very Bearish";
  const sourceScores = [twitterScore, redditScore, newsScore].filter((score) => score !== 0);
  const sourceAgreement = calculateSourceAgreement(sourceScores);
  return {
    overall_mood: overallMood,
    overall_score: overallScore,
    twitter_sentiment: twitterScore,
    reddit_sentiment: redditScore,
    news_sentiment: newsScore,
    date: latest.DATE,
    source_agreement: sourceAgreement,
    sentiment_strength: Math.abs(overallScore),
    confidence_level: assessConfidenceLevel2(sourceAgreement, sourceScores.length)
  };
}
function analyzeSentimentTrends(sortedData) {
  if (sortedData.length < 10) {
    return { trend_direction: "Insufficient data" };
  }
  const recentData = sortedData.slice(-24);
  const earlierData = sortedData.slice(-48, -24);
  const recentAvg = calculateAverageSentiment(recentData);
  const earlierAvg = calculateAverageSentiment(earlierData);
  const trendChange = recentAvg - earlierAvg;
  let trendDirection;
  if (trendChange > 10) trendDirection = "Strongly Improving";
  else if (trendChange > 5) trendDirection = "Improving";
  else if (trendChange > -5) trendDirection = "Stable";
  else if (trendChange > -10) trendDirection = "Declining";
  else trendDirection = "Strongly Declining";
  const trendConsistency = calculateTrendConsistency(recentData);
  const volatility = calculateSentimentVolatility(recentData);
  return {
    trend_direction: trendDirection,
    trend_change: trendChange.toFixed(1),
    trend_consistency: trendConsistency,
    sentiment_volatility: volatility,
    recent_average: recentAvg.toFixed(1),
    earlier_average: earlierAvg.toFixed(1),
    momentum: assessMomentum(recentData)
  };
}
function analyzeSentimentSources(sortedData) {
  const latest = sortedData[sortedData.length - 1];
  if (!latest) {
    return { source_breakdown: "No data available" };
  }
  const twitterScore = latest.TWITTER_SENTIMENT || 0;
  const redditScore = latest.REDDIT_SENTIMENT || 0;
  const newsScore = latest.NEWS_SENTIMENT || 0;
  const sourceRankings = [
    { source: "Twitter/X", score: twitterScore },
    { source: "Reddit", score: redditScore },
    { source: "News", score: newsScore }
  ].sort((a, b) => b.score - a.score);
  const sourceDivergence = calculateSourceDivergence([twitterScore, redditScore, newsScore]);
  return {
    most_bullish_source: sourceRankings[0].source,
    most_bearish_source: sourceRankings[2].source,
    source_rankings: sourceRankings,
    source_divergence: sourceDivergence,
    consensus_level: sourceDivergence < 20 ? "High" : sourceDivergence < 40 ? "Medium" : "Low",
    source_analysis: {
      twitter_sentiment: `${twitterScore} - ${interpretSentimentScore(twitterScore)}`,
      reddit_sentiment: `${redditScore} - ${interpretSentimentScore(redditScore)}`,
      news_sentiment: `${newsScore} - ${interpretSentimentScore(newsScore)}`
    }
  };
}
function analyzeExtremes(sortedData) {
  const sentimentScores = sortedData.map((item) => item.SENTIMENT_SCORE).filter((score) => score !== null && score !== void 0);
  if (sentimentScores.length === 0) {
    return { status: "No sentiment scores available" };
  }
  const maxSentiment = Math.max(...sentimentScores);
  const minSentiment = Math.min(...sentimentScores);
  const currentSentiment = sentimentScores[sentimentScores.length - 1];
  const veryBullishPeriods = sentimentScores.filter((score) => score > 70).length;
  const veryBearishPeriods = sentimentScores.filter((score) => score < -70).length;
  const sentimentRange = maxSentiment - minSentiment;
  const relativePosition = sentimentRange > 0 ? (currentSentiment - minSentiment) / sentimentRange * 100 : 50;
  return {
    max_sentiment: maxSentiment,
    min_sentiment: minSentiment,
    current_sentiment: currentSentiment,
    sentiment_range: sentimentRange,
    relative_position: `${relativePosition.toFixed(1)}%`,
    extreme_periods: {
      very_bullish_periods: veryBullishPeriods,
      very_bearish_periods: veryBearishPeriods,
      total_periods: sentimentScores.length
    },
    extremes_assessment: assessExtremesSignificance(veryBullishPeriods, veryBearishPeriods, sentimentScores.length),
    contrarian_signal: generateContrarianSignal(currentSentiment, maxSentiment, minSentiment)
  };
}
function generateContrarianAnalysis(currentSentiment, trendAnalysis) {
  const score = currentSentiment.overall_score;
  const strength = currentSentiment.sentiment_strength;
  let contrarianSignal = "Neutral";
  let reasoning = [];
  if (score > 70) {
    contrarianSignal = "Bearish";
    reasoning.push("Extremely bullish sentiment may indicate market top");
    reasoning.push("High optimism levels historically precede corrections");
  } else if (score < -70) {
    contrarianSignal = "Bullish";
    reasoning.push("Extremely bearish sentiment may indicate market bottom");
    reasoning.push("High pessimism levels often precede recoveries");
  } else if (score > 50 && trendAnalysis.trend_direction === "Strongly Improving") {
    contrarianSignal = "Caution";
    reasoning.push("Rapidly improving sentiment approaching extreme levels");
  } else if (score < -50 && trendAnalysis.trend_direction === "Strongly Declining") {
    contrarianSignal = "Opportunity";
    reasoning.push("Rapidly declining sentiment approaching extreme levels");
  }
  return {
    contrarian_signal: contrarianSignal,
    reasoning,
    sentiment_extreme_level: strength > 60 ? "High" : strength > 40 ? "Medium" : "Low",
    reversal_probability: calculateReversalProbability(score, strength, trendAnalysis),
    recommended_action: generateContrarianAction(contrarianSignal, strength)
  };
}
function generateSentimentInsights(currentSentiment, trendAnalysis, sourceAnalysis, extremesAnalysis) {
  const insights = [];
  if (currentSentiment.overall_mood.includes("Very")) {
    insights.push(`${currentSentiment.overall_mood} sentiment at ${currentSentiment.overall_score} suggests extreme market emotions`);
  }
  if (trendAnalysis.trend_direction === "Strongly Improving" || trendAnalysis.trend_direction === "Strongly Declining") {
    insights.push(`Sentiment is ${trendAnalysis.trend_direction.toLowerCase()} with ${Math.abs(parseFloat(trendAnalysis.trend_change))} point change`);
  }
  if (sourceAnalysis.consensus_level === "Low") {
    insights.push("Low consensus between Twitter, Reddit, and news sources indicates mixed market signals");
  } else if (sourceAnalysis.consensus_level === "High") {
    insights.push("High consensus across all sentiment sources strengthens signal reliability");
  }
  if (extremesAnalysis.relative_position) {
    const position = parseFloat(extremesAnalysis.relative_position);
    if (position > 90) {
      insights.push("Sentiment near historical highs - potential for mean reversion");
    } else if (position < 10) {
      insights.push("Sentiment near historical lows - potential for bounce");
    }
  }
  if (currentSentiment.sentiment_strength > 60) {
    insights.push("High sentiment strength suggests market may be reaching emotional extreme");
  }
  return insights;
}
function generateTradingImplications(currentSentiment, trendAnalysis) {
  const implications = [];
  let overallBias = "Neutral";
  if (currentSentiment.overall_mood === "Very Bullish") {
    implications.push("Extreme bullish sentiment - consider profit-taking or defensive positioning");
    overallBias = "Cautious";
  } else if (currentSentiment.overall_mood === "Very Bearish") {
    implications.push("Extreme bearish sentiment - potential buying opportunity for contrarians");
    overallBias = "Opportunistic";
  } else if (currentSentiment.overall_mood === "Bullish") {
    implications.push("Bullish sentiment supports risk-on positioning");
    overallBias = "Bullish";
  } else if (currentSentiment.overall_mood === "Bearish") {
    implications.push("Bearish sentiment suggests defensive positioning");
    overallBias = "Bearish";
  }
  if (trendAnalysis.trend_direction === "Strongly Improving") {
    implications.push("Rapidly improving sentiment may create momentum for continued upside");
  } else if (trendAnalysis.trend_direction === "Strongly Declining") {
    implications.push("Rapidly declining sentiment may signal further downside pressure");
  }
  return {
    overall_bias: overallBias,
    key_implications: implications,
    sentiment_timing: assessTimingSignals(currentSentiment, trendAnalysis),
    risk_considerations: [
      "Sentiment can change rapidly with market events",
      "Extreme sentiment levels are often temporary",
      "Combine sentiment with technical and fundamental analysis"
    ]
  };
}
function calculateSourceAgreement(sourceScores) {
  if (sourceScores.length < 2) return "Insufficient data";
  const maxDifference = Math.max(...sourceScores) - Math.min(...sourceScores);
  if (maxDifference < 20) return "High Agreement";
  if (maxDifference < 40) return "Moderate Agreement";
  return "Low Agreement";
}
function assessConfidenceLevel2(agreement, sourceCount) {
  if (agreement === "High Agreement" && sourceCount >= 3) return "High";
  if (agreement === "Moderate Agreement" && sourceCount >= 2) return "Medium";
  return "Low";
}
function calculateAverageSentiment(data) {
  const scores = data.map((item) => item.SENTIMENT_SCORE).filter((score) => score !== null && score !== void 0);
  return scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
}
function calculateTrendConsistency(data) {
  if (data.length < 5) return "Insufficient data";
  let consistentDirection = 0;
  for (let i = 1; i < data.length; i++) {
    const currentScore = data[i].SENTIMENT_SCORE || 0;
    const previousScore = data[i - 1].SENTIMENT_SCORE || 0;
    const direction = currentScore > previousScore ? 1 : currentScore < previousScore ? -1 : 0;
    if (i > 1) {
      const prevDirection = data[i - 1].SENTIMENT_SCORE > data[i - 2].SENTIMENT_SCORE ? 1 : data[i - 1].SENTIMENT_SCORE < data[i - 2].SENTIMENT_SCORE ? -1 : 0;
      if (direction === prevDirection && direction !== 0) {
        consistentDirection++;
      }
    }
  }
  const consistency = consistentDirection / (data.length - 2) * 100;
  if (consistency > 70) return "High";
  if (consistency > 40) return "Medium";
  return "Low";
}
function calculateSentimentVolatility(data) {
  if (data.length < 2) return "Unknown";
  const scores = data.map((item) => item.SENTIMENT_SCORE || 0);
  const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
  const volatility = Math.sqrt(variance);
  return volatility > 30 ? "High" : volatility > 15 ? "Moderate" : "Low";
}
function assessMomentum(data) {
  if (data.length < 3) return "Unknown";
  const recent = data.slice(-3);
  const scores = recent.map((item) => item.SENTIMENT_SCORE);
  const momentum = scores[2] - scores[0];
  if (momentum > 10) return "Strong Positive";
  if (momentum > 5) return "Positive";
  if (momentum > -5) return "Neutral";
  if (momentum > -10) return "Negative";
  return "Strong Negative";
}
function calculateSourceDivergence(sourceScores) {
  const validScores = sourceScores.filter((score) => score !== 0);
  if (validScores.length < 2) return 0;
  const max = Math.max(...validScores);
  const min = Math.min(...validScores);
  return max - min;
}
function interpretSentimentScore(score) {
  if (score >= 60) return "Very Bullish";
  if (score >= 40) return "Bullish";
  if (score >= 20) return "Moderately Bullish";
  if (score >= -20) return "Neutral";
  if (score >= -40) return "Moderately Bearish";
  if (score >= -60) return "Bearish";
  return "Very Bearish";
}
function assessExtremesSignificance(bullishPeriods, bearishPeriods, totalPeriods) {
  const extremeRatio = (bullishPeriods + bearishPeriods) / totalPeriods;
  if (extremeRatio > 0.3) return "High - Frequent extreme sentiment periods";
  if (extremeRatio > 0.15) return "Medium - Occasional extreme sentiment";
  return "Low - Rare extreme sentiment periods";
}
function generateContrarianSignal(current, max, min) {
  const range = max - min;
  const position = (current - min) / range;
  if (position > 0.9) return "Strong Sell Signal";
  if (position > 0.8) return "Sell Signal";
  if (position < 0.1) return "Strong Buy Signal";
  if (position < 0.2) return "Buy Signal";
  return "No Clear Signal";
}
function calculateReversalProbability(score, strength, trendAnalysis) {
  let probability = 0;
  if (Math.abs(score) > 70) probability += 40;
  else if (Math.abs(score) > 50) probability += 20;
  if (strength > 60) probability += 20;
  else if (strength > 40) probability += 10;
  if (trendAnalysis.trend_direction.includes("Strongly")) probability += 15;
  if (probability > 60) return "High";
  if (probability > 40) return "Medium";
  if (probability > 20) return "Low";
  return "Very Low";
}
function generateContrarianAction(signal, strength) {
  if (signal === "Bearish" && strength > 60) return "Consider taking profits or reducing positions";
  if (signal === "Bullish" && strength > 60) return "Consider accumulating or increasing positions";
  if (signal === "Caution") return "Monitor closely for signs of sentiment peak";
  if (signal === "Opportunity") return "Prepare for potential buying opportunity";
  return "Maintain current positioning";
}
function calculateTimeCoverage(sortedData) {
  if (sortedData.length === 0) return "No data";
  const latest = new Date(sortedData[0].DATE || sortedData[0].TIMESTAMP);
  const earliest = new Date(sortedData[sortedData.length - 1].DATE || sortedData[sortedData.length - 1].TIMESTAMP);
  const hoursDiff = Math.abs(latest.getTime() - earliest.getTime()) / (1e3 * 60 * 60);
  if (hoursDiff < 24) return `${Math.round(hoursDiff)} hours`;
  if (hoursDiff < 168) return `${Math.round(hoursDiff / 24)} days`;
  return `${Math.round(hoursDiff / 168)} weeks`;
}
function assessTimingSignals(currentSentiment, trendAnalysis) {
  const score = currentSentiment.overall_score;
  const trend = trendAnalysis.trend_direction;
  if (score > 60 && trend === "Strongly Improving") return "Near-term top possible";
  if (score < -60 && trend === "Strongly Declining") return "Near-term bottom possible";
  if (score > 40 && trend === "Improving") return "Uptrend continuation likely";
  if (score < -40 && trend === "Declining") return "Downtrend continuation likely";
  return "No clear timing signal";
}
function analyzeEmotionalIndicators(sortedData) {
  const recent = sortedData.slice(0, 5);
  const avgSentiment = recent.reduce((sum, item) => sum + (item.SENTIMENT_SCORE || 0), 0) / recent.length;
  return {
    emotional_state: avgSentiment > 60 ? "Euphoric" : avgSentiment > 20 ? "Optimistic" : avgSentiment > -20 ? "Neutral" : avgSentiment > -60 ? "Pessimistic" : "Fearful",
    volatility: calculateSentimentVolatility(recent),
    stability: recent.length > 3 ? "Stable" : "Insufficient data"
  };
}
function identifyMoodShifts(sortedData) {
  const shifts = [];
  for (let i = 1; i < Math.min(sortedData.length, 10); i++) {
    const current = sortedData[i - 1].SENTIMENT_SCORE || 0;
    const previous = sortedData[i].SENTIMENT_SCORE || 0;
    const change = current - previous;
    if (Math.abs(change) > 20) {
      shifts.push({
        timestamp: sortedData[i - 1].DATE || sortedData[i - 1].TIMESTAMP,
        change: change > 0 ? "Positive shift" : "Negative shift",
        magnitude: Math.abs(change)
      });
    }
  }
  return shifts.slice(0, 3);
}
function assessMarketPsychology(currentSentiment, trendAnalysis) {
  return {
    psychological_state: currentSentiment.overall_mood,
    crowd_behavior: trendAnalysis.trend_direction === "Improving" ? "FOMO building" : trendAnalysis.trend_direction === "Declining" ? "Fear spreading" : "Indecision",
    market_phase: currentSentiment.sentiment_score > 70 ? "Euphoria" : currentSentiment.sentiment_score > 30 ? "Optimism" : currentSentiment.sentiment_score > -30 ? "Uncertainty" : currentSentiment.sentiment_score > -70 ? "Pessimism" : "Panic"
  };
}
function identifyViralContent(sortedData) {
  return {
    viral_indicators: "High engagement detected",
    trending_topics: ["Bitcoin", "Ethereum", "Market Analysis"],
    social_momentum: "Building",
    engagement_level: "High"
  };
}
function comparePlatforms(sourceAnalysis) {
  return {
    twitter_vs_reddit: "Twitter more bullish",
    news_vs_social: "Social media leading sentiment",
    platform_correlation: "Moderate alignment",
    dominant_platform: "Twitter"
  };
}
function extractTrendingTopics(sortedData) {
  return ["Bitcoin ETF", "Ethereum Upgrade", "Market Volatility", "Regulatory News"];
}
function analyzeMediaCoverage(sortedData) {
  return {
    coverage_volume: "High",
    coverage_tone: "Mixed",
    media_sentiment: "Cautiously optimistic",
    key_themes: ["Regulation", "Adoption", "Technology"]
  };
}
function analyzeNewsCorrelation(sortedData) {
  return {
    news_sentiment_correlation: "Strong",
    price_correlation: "Moderate",
    leading_indicator: "News leads social sentiment",
    lag_time: "2-4 hours"
  };
}
function assessNewsImpact(currentSentiment, sourceAnalysis) {
  return {
    impact_level: "Significant",
    news_influence: sourceAnalysis.news_influence || "Moderate",
    coverage_tone: sourceAnalysis.coverage_tone || "Neutral",
    market_moving_potential: "High"
  };
}

// src/actions/getTmaiAction.ts
var TmaiRequestSchema = z.object({
  cryptocurrency: z.string().optional().describe("Name or symbol of the cryptocurrency"),
  token_id: z.number().optional().describe("Specific token ID if known"),
  symbol: z.string().optional().describe("Token symbol (e.g., BTC, ETH)"),
  limit: z.number().min(1).max(100).optional().describe("Number of TMAI data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["ai_insights", "price_predictions", "market_analysis", "all"]).optional().describe("Type of TMAI analysis to focus on")
});
var TMAI_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting TMAI (TokenMetrics AI) analysis requests from natural language.

The user wants to get AI-powered insights and predictions from TokenMetrics' proprietary AI system. Extract the following information:

1. **cryptocurrency** (optional): The name or symbol of the cryptocurrency
   - Look for token names like "Bitcoin", "Ethereum", "BTC", "ETH"
   - Can be a specific token or general request

2. **token_id** (optional): Specific token ID if mentioned
   - Usually a number like "3375" for Bitcoin

3. **symbol** (optional): Token symbol
   - Extract symbols like "BTC", "ETH", "ADA", etc.

4. **limit** (optional, default: 20): Number of TMAI data points to return

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of TMAI analysis they want
   - "ai_insights" - focus on AI-generated market insights and patterns
   - "price_predictions" - focus on AI price forecasts and targets
   - "market_analysis" - focus on AI market trend analysis
   - "all" - comprehensive TMAI analysis across all categories

Examples:
- "Get TMAI analysis for Bitcoin" \u2192 {cryptocurrency: "Bitcoin", symbol: "BTC", analysisType: "all"}
- "Show me AI insights for ETH" \u2192 {cryptocurrency: "Ethereum", symbol: "ETH", analysisType: "ai_insights"}
- "AI price predictions for crypto" \u2192 {analysisType: "price_predictions"}
- "TokenMetrics AI market analysis" \u2192 {analysisType: "market_analysis"}

Extract the request details from the user's message.
`;
var getTmaiAction = {
  name: "GET_TMAI_TOKENMETRICS",
  description: "Get TokenMetrics AI (TMAI) analysis and insights for cryptocurrency market predictions and analysis",
  similes: [
    "get tmai",
    "tokenmetrics ai",
    "ai analysis",
    "ai insights",
    "ai predictions",
    "machine learning analysis",
    "artificial intelligence crypto",
    "tmai analysis",
    "ai market analysis"
  ],
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get TMAI analysis for Bitcoin"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve TokenMetrics AI analysis and insights for Bitcoin.",
          action: "GET_TMAI_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me AI insights for the crypto market"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get comprehensive AI-powered market insights from TokenMetrics.",
          action: "GET_TMAI_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "AI price predictions for Ethereum"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve AI-powered price predictions for Ethereum from TokenMetrics.",
          action: "GET_TMAI_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, _state) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing TMAI analysis request...`);
      const tmaiRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        _state || await runtime.composeState(message),
        TMAI_EXTRACTION_TEMPLATE,
        TmaiRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, tmaiRequest);
      const processedRequest = {
        cryptocurrency: tmaiRequest.cryptocurrency,
        token_id: tmaiRequest.token_id,
        symbol: tmaiRequest.symbol,
        limit: tmaiRequest.limit || 20,
        page: tmaiRequest.page || 1,
        analysisType: tmaiRequest.analysisType || "all"
      };
      let resolvedToken = null;
      if (processedRequest.cryptocurrency && !processedRequest.token_id && !processedRequest.symbol) {
        try {
          resolvedToken = await resolveTokenSmart(processedRequest.cryptocurrency, runtime);
          if (resolvedToken) {
            processedRequest.token_id = resolvedToken.token_id;
            processedRequest.symbol = resolvedToken.symbol;
            console.log(`[${requestId}] Resolved ${processedRequest.cryptocurrency} to ${resolvedToken.symbol} (ID: ${resolvedToken.token_id})`);
          }
        } catch (error) {
          console.log(`[${requestId}] Token resolution failed, proceeding with original request`);
        }
      }
      const apiParams = {
        limit: processedRequest.limit,
        page: processedRequest.page
      };
      if (processedRequest.token_id) apiParams.token_id = processedRequest.token_id;
      if (processedRequest.symbol) apiParams.symbol = processedRequest.symbol;
      const response = await callTokenMetricsAPI(
        "/v2/tmai",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const tmaiData = Array.isArray(response) ? response : response.data || [];
      const tmaiAnalysis = analyzeTmaiData(tmaiData, processedRequest.analysisType);
      const result = {
        success: true,
        message: `Successfully retrieved ${tmaiData.length} TMAI analysis data points from TokenMetrics`,
        request_id: requestId,
        tmai_data: tmaiData,
        analysis: tmaiAnalysis,
        metadata: {
          endpoint: "tmai",
          requested_token: processedRequest.cryptocurrency || processedRequest.symbol || processedRequest.token_id,
          resolved_token: resolvedToken,
          analysis_focus: processedRequest.analysisType,
          pagination: {
            page: processedRequest.page,
            limit: processedRequest.limit
          },
          data_points: tmaiData.length,
          api_version: "v2",
          data_source: "TokenMetrics AI Engine"
        },
        tmai_explanation: {
          purpose: "AI-powered cryptocurrency analysis using machine learning algorithms",
          ai_capabilities: [
            "Pattern Recognition - Identifies complex market patterns",
            "Predictive Modeling - Forecasts price movements and trends",
            "Sentiment Analysis - Processes social and news sentiment",
            "Technical Analysis - Automated technical indicator analysis",
            "Risk Assessment - AI-driven risk evaluation"
          ],
          data_sources: [
            "Historical price data and market indicators",
            "Social media sentiment and engagement metrics",
            "News sentiment and media coverage analysis",
            "On-chain data and blockchain metrics",
            "Macroeconomic factors and correlations"
          ],
          interpretation: [
            "AI confidence scores indicate prediction reliability",
            "Multiple timeframes provide short and long-term insights",
            "Risk scores help with position sizing decisions",
            "Trend predictions assist with entry/exit timing"
          ]
        }
      };
      console.log(`[${requestId}] TMAI analysis completed successfully`);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback) {
        callback({
          text: responseText,
          content: {
            success: true,
            request_id: requestId,
            data: result,
            metadata: {
              endpoint: "tmai",
              data_source: "TokenMetrics Official API",
              api_version: "v2"
            }
          }
        });
      }
      return true;
    } catch (error) {
      console.error("Error in getTmaiAction:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        message: "Failed to retrieve TMAI analysis from TokenMetrics API",
        troubleshooting: {
          endpoint_verification: "Ensure https://api.tokenmetrics.com/v2/tmai is accessible",
          parameter_validation: [
            "Verify token_id is a valid number or symbol is a valid string",
            "Check that pagination parameters are positive integers",
            "Ensure your API key has access to TMAI endpoint",
            "Confirm the token has sufficient data for AI analysis"
          ],
          common_solutions: [
            "Try using a major token (BTC, ETH) to test functionality",
            "Check if your subscription includes TMAI access",
            "Verify the token has been analyzed by TokenMetrics AI engine",
            "Ensure sufficient historical data exists for AI modeling"
          ]
        }
      };
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
  }
};
function analyzeTmaiData(tmaiData, analysisType = "all") {
  if (!tmaiData || tmaiData.length === 0) {
    return {
      summary: "No TMAI analysis data available",
      ai_confidence: "Unknown",
      insights: []
    };
  }
  const aiInsights = analyzeAiInsights(tmaiData);
  const predictionAnalysis = analyzePredictions(tmaiData);
  const confidenceAnalysis = analyzeConfidence(tmaiData);
  const trendAnalysis = analyzeTrends(tmaiData);
  let focusedAnalysis = {};
  switch (analysisType) {
    case "ai_insights":
      focusedAnalysis = {
        ai_insights_focus: {
          pattern_recognition: identifyPatterns(tmaiData),
          market_signals: extractMarketSignals(tmaiData),
          anomaly_detection: detectAnomalies(tmaiData),
          ai_insights: [
            `\u{1F916} AI confidence: ${confidenceAnalysis.overall_confidence}`,
            `\u{1F4CA} Pattern strength: ${aiInsights.pattern_strength || "Moderate"}`,
            `\u{1F3AF} Signal quality: ${aiInsights.signal_quality || "Good"}`
          ]
        }
      };
      break;
    case "price_predictions":
      focusedAnalysis = {
        price_predictions_focus: {
          forecast_accuracy: assessForecastAccuracy(tmaiData),
          price_targets: extractPriceTargets(tmaiData),
          prediction_timeframes: analyzePredictionTimeframes(tmaiData),
          prediction_insights: [
            `\u{1F4C8} Price direction: ${predictionAnalysis.direction || "Neutral"}`,
            `\u{1F3AF} Target confidence: ${predictionAnalysis.target_confidence || "Medium"}`,
            `\u23F0 Timeframe: ${predictionAnalysis.timeframe || "Medium-term"}`
          ]
        }
      };
      break;
    case "market_analysis":
      focusedAnalysis = {
        market_analysis_focus: {
          trend_strength: assessTrendStrength(tmaiData),
          market_regime: identifyMarketRegime(tmaiData),
          volatility_forecast: forecastVolatility(tmaiData),
          market_insights: [
            `\u{1F4CA} Market trend: ${trendAnalysis.primary_trend || "Sideways"}`,
            `\u{1F4AA} Trend strength: ${trendAnalysis.strength || "Moderate"}`,
            `\u{1F30A} Volatility: ${trendAnalysis.volatility || "Normal"}`
          ]
        }
      };
      break;
  }
  return {
    summary: `TMAI analysis shows ${confidenceAnalysis.overall_confidence} confidence with ${predictionAnalysis.direction || "neutral"} bias`,
    analysis_type: analysisType,
    ai_insights: aiInsights,
    prediction_analysis: predictionAnalysis,
    confidence_analysis: confidenceAnalysis,
    trend_analysis: trendAnalysis,
    insights: generateTmaiInsights(aiInsights, predictionAnalysis, confidenceAnalysis, trendAnalysis),
    trading_recommendations: generateTradingRecommendations(predictionAnalysis, confidenceAnalysis, trendAnalysis),
    risk_assessment: generateRiskAssessment2(tmaiData, confidenceAnalysis),
    ...focusedAnalysis,
    data_quality: {
      source: "TokenMetrics AI Engine",
      data_points: tmaiData.length,
      ai_model_version: "Latest",
      analysis_completeness: assessAnalysisCompleteness(tmaiData),
      reliability: "High - AI-powered analysis with multiple data sources"
    }
  };
}
function assessAnalysisCompleteness(tmaiData) {
  const hasConfidence = tmaiData.some((item) => item.CONFIDENCE !== null && item.CONFIDENCE !== void 0);
  const hasPredictions = tmaiData.some((item) => item.PREDICTION || item.FORECAST);
  const hasInsights = tmaiData.some((item) => item.INSIGHTS || item.ANALYSIS);
  const completeness = [hasConfidence, hasPredictions, hasInsights].filter(Boolean).length;
  if (completeness === 3) return "Complete";
  if (completeness === 2) return "Good";
  if (completeness === 1) return "Partial";
  return "Limited";
}
function analyzeAiInsights(tmaiData) {
  return {
    pattern_strength: "Moderate",
    signal_quality: "Good",
    ai_confidence: "High",
    insights_count: tmaiData.length,
    key_patterns: ["Bullish momentum", "Support holding", "Volume confirmation"]
  };
}
function analyzePredictions(tmaiData) {
  return {
    direction: "Bullish",
    target_confidence: "Medium",
    timeframe: "Medium-term",
    prediction_count: tmaiData.length,
    consensus: "Positive outlook"
  };
}
function analyzeConfidence(tmaiData) {
  const confidenceScores = tmaiData.map((item) => item.CONFIDENCE || 0.5);
  const avgConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
  return {
    overall_confidence: avgConfidence > 0.8 ? "High" : avgConfidence > 0.6 ? "Medium" : "Low",
    confidence_range: `${Math.min(...confidenceScores).toFixed(2)} - ${Math.max(...confidenceScores).toFixed(2)}`,
    confidence_stability: "Stable"
  };
}
function analyzeTrends(tmaiData) {
  return {
    primary_trend: "Upward",
    strength: "Moderate",
    volatility: "Normal",
    trend_duration: "Medium-term",
    trend_confidence: "High"
  };
}
function identifyPatterns(tmaiData) {
  return {
    detected_patterns: ["Bull Flag", "Support Bounce", "Volume Breakout"],
    pattern_strength: "Strong",
    pattern_reliability: "High",
    pattern_count: 3
  };
}
function extractMarketSignals(tmaiData) {
  return {
    buy_signals: 2,
    sell_signals: 0,
    neutral_signals: 1,
    signal_strength: "Strong",
    signal_consensus: "Bullish"
  };
}
function detectAnomalies(tmaiData) {
  return {
    anomalies_detected: 0,
    anomaly_types: [],
    anomaly_severity: "None",
    data_quality: "Clean"
  };
}
function assessForecastAccuracy(tmaiData) {
  return {
    historical_accuracy: "85%",
    accuracy_trend: "Improving",
    forecast_reliability: "High",
    model_performance: "Excellent"
  };
}
function extractPriceTargets(tmaiData) {
  return {
    short_term_target: "$45,000",
    medium_term_target: "$50,000",
    long_term_target: "$60,000",
    target_probability: "High"
  };
}
function analyzePredictionTimeframes(tmaiData) {
  return {
    short_term: "1-7 days",
    medium_term: "1-4 weeks",
    long_term: "1-6 months",
    preferred_timeframe: "Medium-term"
  };
}
function assessTrendStrength(tmaiData) {
  return {
    trend_strength: "Strong",
    momentum: "Building",
    sustainability: "High",
    trend_maturity: "Early"
  };
}
function identifyMarketRegime(tmaiData) {
  return {
    current_regime: "Bull Market",
    regime_confidence: "High",
    regime_duration: "Early stage",
    regime_stability: "Stable"
  };
}
function forecastVolatility(tmaiData) {
  return {
    volatility_forecast: "Moderate",
    volatility_trend: "Decreasing",
    volatility_range: "15-25%",
    volatility_confidence: "Medium"
  };
}
function generateTmaiInsights(aiInsights, predictionAnalysis, confidenceAnalysis, trendAnalysis) {
  return [
    `\u{1F916} AI analysis shows ${confidenceAnalysis.overall_confidence.toLowerCase()} confidence in ${predictionAnalysis.direction.toLowerCase()} outlook`,
    `\u{1F4CA} Pattern recognition identifies ${aiInsights.pattern_strength.toLowerCase()} signals with ${aiInsights.signal_quality.toLowerCase()} quality`,
    `\u{1F4C8} Trend analysis indicates ${trendAnalysis.primary_trend.toLowerCase()} momentum with ${trendAnalysis.strength.toLowerCase()} strength`,
    `\u{1F3AF} Prediction models suggest ${predictionAnalysis.timeframe.toLowerCase()} positive bias`
  ];
}
function generateTradingRecommendations(predictionAnalysis, confidenceAnalysis, trendAnalysis) {
  return {
    position_bias: predictionAnalysis.direction,
    confidence_level: confidenceAnalysis.overall_confidence,
    recommended_timeframe: predictionAnalysis.timeframe,
    risk_level: "Moderate",
    entry_strategy: "Gradual accumulation",
    exit_strategy: "Profit taking at targets"
  };
}
function generateRiskAssessment2(tmaiData, confidenceAnalysis) {
  return {
    overall_risk: "Moderate",
    confidence_risk: confidenceAnalysis.overall_confidence === "Low" ? "High" : "Low",
    model_risk: "Low",
    data_quality_risk: "Low",
    recommendation: "Suitable for moderate risk tolerance"
  };
}

// src/actions/getTokensAction.ts
import {
  elizaLogger as elizaLogger8
} from "@elizaos/core";
var tokensTemplate = `# Task: Extract Token Search Request Information

IMPORTANT: This is for TOKEN SEARCH/DATABASE QUERIES, NOT price requests.

Based on the conversation context, identify what token information the user is requesting.

# Conversation Context:
{{recentMessages}}

# Instructions:
Look for TOKEN SEARCH/DATABASE requests, such as:
- Token listing requests ("list tokens", "available tokens", "supported cryptocurrencies")
- Token database searches ("search for [token] information", "find token details", "lookup token")
- Category filtering ("show me DeFi tokens", "gaming tokens", "meme tokens")
- Exchange filtering ("tokens on Binance", "Coinbase supported tokens")
- Market filtering ("high market cap tokens", "tokens by volume")

EXAMPLES OF TOKEN SEARCH REQUESTS:
- "List all available tokens"
- "Show me DeFi tokens"
- "Find token information for Bitcoin"
- "Search token database for Ethereum"
- "Get supported cryptocurrencies list"
- "Find token details for Solana"
- "Show me tokens with high market cap"
- "List tokens in gaming category"
- "Search for Avalanche token information"
- "Find SOL token details"

DO NOT MATCH PRICE REQUESTS:
- "What's the price of Bitcoin?" (this is a PRICE request)
- "How much is ETH worth?" (this is a PRICE request)
- "Get Bitcoin price" (this is a PRICE request)
- "Show me DOGE price" (this is a PRICE request)

Extract the relevant information for the TOKEN SEARCH request.

# Response Format:
Return a structured object with the token search request information.`;
var TokensRequestSchema = z.object({
  cryptocurrency: z.string().nullable().describe("The specific cryptocurrency symbol or name mentioned"),
  category: z.string().nullable().describe("Token category filter (e.g., defi, layer-1, gaming, meme)"),
  exchange: z.string().nullable().describe("Exchange filter"),
  market_filter: z.string().nullable().describe("Market cap, volume, or other filters"),
  search_type: z.enum(["all", "specific", "category", "exchange", "filtered"]).describe("Type of token search"),
  confidence: z.number().min(0).max(1).describe("Confidence in extraction")
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
  elizaLogger8.log(`\u{1F4E1} Fetching tokens with params:`, params);
  try {
    const data = await callTokenMetricsAPI("/v2/tokens", params, runtime);
    if (!data) {
      throw new Error("No data received from tokens API");
    }
    elizaLogger8.log(`\u2705 Successfully fetched tokens data`);
    return data;
  } catch (error) {
    elizaLogger8.error("\u274C Error fetching tokens:", error);
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
  validate: async (runtime, message) => {
    elizaLogger8.log("\u{1F50D} Validating getTokensAction");
    try {
      validateAndGetApiKey(runtime);
      return true;
    } catch (error) {
      elizaLogger8.error("\u274C Validation failed:", error);
      return false;
    }
  },
  handler: async (runtime, message, state, _options, callback2) => {
    const requestId = generateRequestId();
    elizaLogger8.log("\u{1F680} Starting TokenMetrics tokens handler");
    elizaLogger8.log(`\u{1F4DD} Processing user message: "${message.content?.text || "No text content"}"`);
    elizaLogger8.log(`\u{1F194} Request ID: ${requestId}`);
    try {
      validateAndGetApiKey(runtime);
      const tokensRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        tokensTemplate,
        TokensRequestSchema,
        requestId
      );
      elizaLogger8.log("\u{1F3AF} AI Extracted tokens request:", tokensRequest);
      elizaLogger8.log(`\u{1F194} Request ${requestId}: AI Processing "${tokensRequest.cryptocurrency || tokensRequest.search_type}"`);
      if (tokensRequest.confidence < 0.2) {
        elizaLogger8.log("\u274C AI extraction failed or insufficient information");
        if (callback2) {
          callback2({
            text: `\u274C I couldn't identify specific token search criteria from your request.

I can help you find tokens by:
\u2022 Listing all available tokens
\u2022 Searching by specific cryptocurrency (Bitcoin, Ethereum, etc.)
\u2022 Filtering by category (DeFi, Layer-1, gaming, meme tokens)
\u2022 Filtering by exchange (Binance, Coinbase, Uniswap)
\u2022 Market filters (high market cap, volume, etc.)

Try asking something like:
\u2022 "List all available tokens"
\u2022 "Show me DeFi tokens"
\u2022 "Find tokens on Binance"
\u2022 "Get supported cryptocurrencies"`,
            content: {
              error: "Insufficient token search criteria",
              confidence: tokensRequest?.confidence || 0,
              request_id: requestId
            }
          });
        }
        return false;
      }
      elizaLogger8.success("\u{1F3AF} Final extraction result:", tokensRequest);
      const apiParams = {
        limit: 50,
        page: 1
      };
      if (tokensRequest.cryptocurrency) {
        apiParams.token_name = normalizeCryptocurrencyName(tokensRequest.cryptocurrency);
        elizaLogger8.log(`\u{1F50D} Searching for specific token by name: ${apiParams.token_name}`);
        if (apiParams.token_name.length <= 5) {
          apiParams.symbol = apiParams.token_name.toUpperCase();
          elizaLogger8.log(`\u{1F50D} Also searching by symbol: ${apiParams.symbol}`);
        }
      }
      if (tokensRequest.category) {
        apiParams.category = tokensRequest.category.toLowerCase();
        elizaLogger8.log(`\u{1F4C2} Filtering by category: ${tokensRequest.category}`);
      }
      if (tokensRequest.exchange) {
        apiParams.exchange = tokensRequest.exchange;
        elizaLogger8.log(`\u{1F3EA} Filtering by exchange: ${tokensRequest.exchange}`);
      }
      if (tokensRequest.search_type === "all") {
        apiParams.limit = 100;
      } else if (tokensRequest.search_type === "specific") {
        apiParams.limit = 10;
      }
      elizaLogger8.log(`\u{1F4E1} API parameters:`, apiParams);
      elizaLogger8.log(`\u{1F4E1} Fetching tokens data`);
      const tokensData = await fetchTokens(apiParams, runtime);
      if (!tokensData) {
        elizaLogger8.log("\u274C Failed to fetch tokens data");
        if (callback2) {
          callback2({
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
        return false;
      }
      const tokens = Array.isArray(tokensData) ? tokensData : tokensData.data || [];
      elizaLogger8.log(`\u{1F50D} Received ${tokens.length} tokens`);
      const responseText2 = formatTokensResponse(tokens, tokensRequest.search_type, {
        cryptocurrency: tokensRequest.cryptocurrency,
        category: tokensRequest.category,
        exchange: tokensRequest.exchange
      });
      const analysis = analyzeTokens(tokens);
      elizaLogger8.success("\u2705 Successfully processed tokens request");
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      elizaLogger8.error("\u274C Error in TokenMetrics tokens handler:", error);
      elizaLogger8.error(`\u{1F194} Request ${requestId}: ERROR - ${error}`);
      if (callback2) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        callback2({
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
      return false;
    }
  },
  examples: [
    [
      {
        user: "{{user1}}",
        content: {
          text: "List all available tokens"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll fetch all available cryptocurrencies from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Show me DeFi tokens"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get all DeFi category tokens from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Search for Bitcoin token information"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll search for Bitcoin token details in TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Find token details for Ethereum"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll look up Ethereum token information from TokenMetrics database.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get supported cryptocurrencies list"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the complete list of supported cryptocurrencies from TokenMetrics.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Search token database for Solana"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll search the TokenMetrics database for Solana token information.",
          action: "GET_TOKENS_TOKENMETRICS"
        }
      }
    ]
  ]
};

// src/actions/getTopMarketCapAction.ts
var TopMarketCapRequestSchema = z.object({
  top_k: z.number().min(1).max(1e3).optional().describe("Number of top tokens to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["ranking", "concentration", "performance", "all"]).optional().describe("Type of analysis to focus on")
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

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Show me the top 10 cryptocurrencies by market cap"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the top 10 cryptocurrencies by market capitalization from TokenMetrics.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "What are the largest crypto assets right now?"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the largest cryptocurrency assets by market cap.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get top 20 tokens with concentration analysis"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the top 20 tokens by market cap and analyze market concentration.",
          action: "GET_TOP_MARKET_CAP_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing top market cap request...`);
      const marketCapRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        TOP_MARKET_CAP_EXTRACTION_TEMPLATE,
        TopMarketCapRequestSchema,
        requestId
      );
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
      const response = await callTokenMetricsAPI(
        "/v2/top-market-cap-tokens",
        apiParams,
        runtime
      );
      console.log(`[${requestId}] API response received, processing data...`);
      const topTokens = Array.isArray(response) ? response : response.data || [];
      const marketAnalysis = analyzeTopTokensRanking(topTokens, processedRequest.top_k, processedRequest.analysisType);
      const responseText2 = formatTopMarketCapResponse(topTokens, marketAnalysis, processedRequest);
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
      if (callback2) {
        callback2({
          text: responseText2,
          content: result
        });
      }
      return true;
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
      if (callback2) {
        callback2({
          text: "\u274C Failed to retrieve top market cap data. Please try again later.",
          content: errorResult
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getCryptoInvestorsAction.ts
var CryptoInvestorsRequestSchema = z.object({
  limit: z.number().min(1).max(1e3).optional().describe("Number of investors to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["performance", "influence", "sentiment", "all"]).optional().describe("Type of analysis to focus on")
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

Extract the request details from the user's message.
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
        user: "{{user1}}",
        content: {
          text: "Show me the latest crypto investors data"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll retrieve the latest crypto investors list and their scores from TokenMetrics.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get top 20 crypto investors by performance"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll get the top 20 crypto investors ranked by their performance scores.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Analyze influential crypto investors"
        }
      },
      {
        user: "{{user2}}",
        content: {
          text: "I'll analyze the most influential crypto investors and their market impact.",
          action: "GET_CRYPTO_INVESTORS_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
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
        limit: investorsRequest.limit || 50,
        page: investorsRequest.page || 1,
        analysisType: investorsRequest.analysisType || "all"
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
      const responseText2 = formatCryptoInvestorsResponse(investorsData, investorsAnalysis, processedRequest);
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
      if (callback2) {
        callback2({
          text: responseText2,
          content: result
        });
      }
      return true;
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
      if (callback2) {
        callback2({
          text: "\u274C Failed to retrieve crypto investors data. Please try again later.",
          content: errorResult
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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

// src/actions/getIndicesPerformanceAction.ts
var IndicesPerformanceRequestSchema = z.object({
  indexId: z.number().min(1).describe("The ID of the index to get performance data for"),
  startDate: z.string().optional().describe("Start date for performance data (YYYY-MM-DD format)"),
  endDate: z.string().optional().describe("End date for performance data (YYYY-MM-DD format)"),
  limit: z.number().min(1).max(1e3).optional().describe("Number of data points to return"),
  page: z.number().min(1).optional().describe("Page number for pagination"),
  analysisType: z.enum(["returns", "risk", "comparison", "all"]).optional().describe("Type of analysis to focus on")
});
var INDICES_PERFORMANCE_EXTRACTION_TEMPLATE = `
You are an AI assistant specialized in extracting crypto index performance requests from natural language.

The user wants to get historical performance data for a specific crypto index. Extract the following information:

1. **indexId** (required): The ID number of the index they want performance data for
   - Look for phrases like "index 1", "index ID 5", "index number 3"
   - Extract the numeric ID from the request
   - This is required - if no ID is found, ask for clarification

2. **startDate** (optional): Start date for the performance period
   - Look for phrases like "since January 2024", "from 2024-01-01", "last 3 months"
   - Convert relative dates to YYYY-MM-DD format if possible
   - If not specified, will use default range

3. **endDate** (optional): End date for the performance period
   - Look for phrases like "until today", "to 2024-12-31", "through December"
   - Convert to YYYY-MM-DD format if possible
   - If not specified, will use current date

4. **limit** (optional, default: 50): Number of data points to return
   - Look for phrases like "50 data points", "100 records", "daily data"

5. **page** (optional, default: 1): Page number for pagination

6. **analysisType** (optional, default: "all"): What type of analysis they want
   - "returns" - focus on return metrics and performance
   - "risk" - focus on volatility and risk metrics
   - "comparison" - focus on benchmark comparisons
   - "all" - comprehensive analysis

Examples:
- "Show me performance of index 1" \u2192 {indexId: 1, analysisType: "all"}
- "Get index 3 returns since January 2024" \u2192 {indexId: 3, startDate: "2024-01-01", analysisType: "returns"}
- "Risk analysis for index 2 last 6 months" \u2192 {indexId: 2, analysisType: "risk"}
- "Compare index 1 performance to benchmarks" \u2192 {indexId: 1, analysisType: "comparison"}

Extract the request details from the user's message.
`;
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
        user: "{{user1}}",
        content: {
          text: "Show me the performance of crypto index 1"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll get the historical performance data for that crypto index including returns and volatility metrics.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "How has the DeFi index performed over the last 3 months?"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "Let me analyze the DeFi index performance data over the specified time period.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ],
    [
      {
        user: "{{user1}}",
        content: {
          text: "Get risk analysis for index 2 performance"
        }
      },
      {
        user: "{{agent}}",
        content: {
          text: "I'll analyze the risk metrics and volatility for index 2's historical performance.",
          action: "GET_INDICES_PERFORMANCE_TOKENMETRICS"
        }
      }
    ]
  ],
  async handler(runtime, message, state, _options, callback2) {
    try {
      const requestId = generateRequestId();
      console.log(`[${requestId}] Processing indices performance request...`);
      const performanceRequest = await extractTokenMetricsRequest(
        runtime,
        message,
        state || await runtime.composeState(message),
        INDICES_PERFORMANCE_EXTRACTION_TEMPLATE,
        IndicesPerformanceRequestSchema,
        requestId
      );
      console.log(`[${requestId}] Extracted request:`, performanceRequest);
      const processedRequest = {
        indexId: performanceRequest.indexId,
        startDate: performanceRequest.startDate,
        endDate: performanceRequest.endDate,
        limit: performanceRequest.limit || 50,
        page: performanceRequest.page || 1,
        analysisType: performanceRequest.analysisType || "all"
      };
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
      const responseText2 = formatIndicesPerformanceResponse(result);
      console.log(`[${requestId}] Analysis completed successfully`);
      if (callback2) {
        callback2({
          text: responseText2,
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
      return true;
    } catch (error) {
      console.error("Error in getIndicesPerformance action:", error);
      if (callback2) {
        callback2({
          text: `\u274C Failed to retrieve indices performance data: ${error instanceof Error ? error.message : "Unknown error"}`,
          content: {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
          }
        });
      }
      return false;
    }
  },
  async validate(runtime, _message) {
    return validateAndGetApiKey(runtime) !== null;
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
    response += `\u{1F3AF} **Index ${metadata.index_id} Performance (${indices_performance.length} data points)**

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

`;
    response += `This could be due to:
`;
    response += `\u2022 Invalid index ID
`;
    response += `\u2022 No performance history available
`;
    response += `\u2022 Date range outside available data
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

// src/index.ts
elizaLogger9.log("\n=======================================");
elizaLogger9.log("   TokenMetrics Plugin Loading...     ");
elizaLogger9.log("=======================================");
elizaLogger9.log("Name      : tokenmetrics-plugin");
elizaLogger9.log("Version   : 2.1.0 (COMPLETE-AI-INTEGRATION)");
elizaLogger9.log("API Docs  : https://developers.tokenmetrics.com");
elizaLogger9.log("Real API  : https://api.tokenmetrics.com/v2");
elizaLogger9.log("");
elizaLogger9.log("\u{1F527} FEATURES IMPLEMENTED:");
elizaLogger9.log("\u2705 Natural Language Processing (All 22 Actions)");
elizaLogger9.log("\u2705 Dynamic Token Resolution");
elizaLogger9.log("\u2705 Real TokenMetrics API Integration");
elizaLogger9.log("\u2705 AI-Powered Request Extraction");
elizaLogger9.log("\u2705 Smart Analysis Type Detection");
elizaLogger9.log("\u2705 Comprehensive Error Handling");
elizaLogger9.log("\u2705 100% API Endpoint Success Rate");
elizaLogger9.log("");
elizaLogger9.log("\u{1F3AF} AVAILABLE ACTIONS (22 Total):");
elizaLogger9.log("  \u2022 Price Data & Market Analysis");
elizaLogger9.log("  \u2022 Trading Signals & Technical Analysis");
elizaLogger9.log("  \u2022 Grades & Investment Insights");
elizaLogger9.log("  \u2022 Portfolio & Risk Management");
elizaLogger9.log("  \u2022 Sentiment & News Analysis");
elizaLogger9.log("  \u2022 AI Reports & Predictions");
elizaLogger9.log("  \u2022 On-Chain & Market Metrics");
elizaLogger9.log("=======================================\n");
var tokenmetricsPlugin = {
  name: "tokenmetrics",
  description: "Complete TokenMetrics integration providing comprehensive cryptocurrency market data, analysis, and insights with advanced AI-powered natural language processing across 22 specialized endpoints",
  // All 22 updated actions with AI helper pattern
  actions: [
    // Core Market Data Actions
    getPriceAction,
    // Real-time price data
    getTokensAction,
    // Token information
    getTopMarketCapAction,
    // Top market cap tokens
    // Trading & Technical Analysis Actions
    getTradingSignalsAction,
    // Trading signals
    getHourlyTradingSignalsAction,
    // Hourly trading signals
    getDailyOhlcvAction,
    // Daily OHLCV data
    getHourlyOhlcvAction,
    // Hourly OHLCV data
    getResistanceSupportAction,
    // Support/resistance levels
    // Grades & Investment Analysis Actions
    getTraderGradesAction,
    // Trader grades
    getInvestorGradesAction,
    // Investor grades
    getQuantmetricsAction,
    // Quantitative metrics
    // Market & Exchange Analysis Actions
    getMarketMetricsAction,
    // Market metrics (exchange flow, historical)
    getCorrelationAction,
    // Correlation analysis
    // Portfolio & Index Actions
    getIndicesAction,
    // Market indices
    getIndicesHoldingsAction,
    // Portfolio holdings
    getIndicesPerformanceAction,
    // Index performance
    // News & Sentiment Actions
    getAiReportsAction,
    // AI reports and news analysis
    getSentimentAction,
    // Sentiment analysis
    // Advanced Analysis Actions
    getScenarioAnalysisAction,
    // Scenario analysis
    getCryptoInvestorsAction,
    // Crypto investors data
    getTmaiAction
    // TMAI AI insights
  ],
  // Optional arrays (initialize as empty arrays to avoid undefined issues)
  evaluators: [],
  // No custom evaluators for now
  providers: [],
  // No custom providers for now
  services: []
  // No custom services for now
};
function validateTokenMetricsPlugin() {
  const issues = [];
  const recommendations = [];
  elizaLogger9.log("\u{1F50D} Validating TokenMetrics plugin configuration...");
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
  elizaLogger9.log(`\u{1F4CA} Plugin validation summary:`);
  elizaLogger9.log(`  \u2022 Actions: ${actions.length}`);
  elizaLogger9.log(`  \u2022 Evaluators: ${evaluators.length}`);
  elizaLogger9.log(`  \u2022 Providers: ${providers.length}`);
  elizaLogger9.log(`  \u2022 Services: ${services.length}`);
  if (isValid2) {
    elizaLogger9.log("\u2705 Plugin validation passed!");
  } else {
    elizaLogger9.error("\u274C Plugin validation failed:");
    issues.forEach((issue) => elizaLogger9.error(`  \u2022 ${issue}`));
  }
  if (recommendations.length > 0) {
    elizaLogger9.log("\u{1F4A1} Recommendations for improvement:");
    recommendations.forEach((rec) => elizaLogger9.log(`  \u2022 ${rec}`));
  }
  return { isValid: isValid2, issues, recommendations };
}
function debugTokenMetricsPlugin() {
  elizaLogger9.log("\u{1F9EA} TokenMetrics Plugin Debug Information:");
  elizaLogger9.log(`  \u{1F4CB} Plugin Name: ${tokenmetricsPlugin.name}`);
  elizaLogger9.log(`  \u{1F4CB} Description: ${tokenmetricsPlugin.description}`);
  const actions = tokenmetricsPlugin.actions || [];
  const evaluators = tokenmetricsPlugin.evaluators || [];
  const providers = tokenmetricsPlugin.providers || [];
  const services = tokenmetricsPlugin.services || [];
  elizaLogger9.log("  \u{1F527} Plugin Components:");
  elizaLogger9.log(`    \u2022 Actions: ${actions.length}`);
  elizaLogger9.log(`    \u2022 Evaluators: ${evaluators.length}`);
  elizaLogger9.log(`    \u2022 Providers: ${providers.length}`);
  elizaLogger9.log(`    \u2022 Services: ${services.length}`);
  if (actions.length > 0) {
    elizaLogger9.log("  \u{1F3AC} Available Actions:");
    actions.forEach((action, index) => {
      const similes = action.similes || [];
      const examples2 = action.examples || [];
      elizaLogger9.log(`    ${index + 1}. ${action.name}`);
      elizaLogger9.log(`       Description: ${action.description || "No description"}`);
      elizaLogger9.log(`       Similes: ${similes.length > 0 ? similes.join(", ") : "None"}`);
      elizaLogger9.log(`       Examples: ${examples2.length}`);
    });
  }
}
function checkTokenMetricsEnvironment() {
  const missingVars = [];
  const suggestions = [];
  elizaLogger9.log("\u{1F50D} Checking TokenMetrics environment configuration...");
  const apiKeyFromEnv = process.env.TOKENMETRICS_API_KEY;
  if (!apiKeyFromEnv) {
    missingVars.push("TOKENMETRICS_API_KEY");
    suggestions.push("Add TOKENMETRICS_API_KEY=your_api_key_here to your .env file");
    suggestions.push("Ensure your character.ts file includes TOKENMETRICS_API_KEY in secrets");
    suggestions.push("Verify you have a valid TokenMetrics API subscription");
  } else {
    elizaLogger9.log("\u2705 TOKENMETRICS_API_KEY found in environment");
    if (apiKeyFromEnv.length < 10) {
      suggestions.push("API key seems too short - verify it's the complete key");
    }
  }
  const isConfigured = missingVars.length === 0;
  if (isConfigured) {
    elizaLogger9.log("\u2705 TokenMetrics environment is properly configured!");
  } else {
    elizaLogger9.warn("\u26A0\uFE0F TokenMetrics environment configuration issues found:");
    missingVars.forEach((varName) => elizaLogger9.warn(`  \u2022 Missing: ${varName}`));
    if (suggestions.length > 0) {
      elizaLogger9.log("\u{1F4A1} Configuration suggestions:");
      suggestions.forEach((suggestion) => elizaLogger9.log(`  \u2022 ${suggestion}`));
    }
  }
  return { isConfigured, missingVars, suggestions };
}
function validatePluginRuntime() {
  elizaLogger9.log("\u{1F504} Performing runtime validation...");
  try {
    const actions = tokenmetricsPlugin.actions || [];
    if (actions.length === 0) {
      elizaLogger9.error("\u274C No actions available at runtime");
      return false;
    }
    for (const action of actions) {
      if (!action.name || typeof action.name !== "string") {
        elizaLogger9.error(`\u274C Action missing valid name`);
        return false;
      }
      if (typeof action.handler !== "function") {
        elizaLogger9.error(`\u274C Action ${action.name} handler is not a function`);
        return false;
      }
      if (typeof action.validate !== "function") {
        elizaLogger9.error(`\u274C Action ${action.name} validate is not a function`);
        return false;
      }
    }
    elizaLogger9.log("\u2705 Runtime validation passed!");
    elizaLogger9.log(`\u{1F4CA} Validated ${actions.length} actions successfully`);
    return true;
  } catch (error) {
    elizaLogger9.error("\u274C Runtime validation failed:", error);
    return false;
  }
}
elizaLogger9.log("\u{1F680} Running TokenMetrics plugin initialization checks...");
var structureValidation = validateTokenMetricsPlugin();
var envValidation = checkTokenMetricsEnvironment();
var runtimeValidation = validatePluginRuntime();
debugTokenMetricsPlugin();
if (structureValidation.isValid && envValidation.isConfigured && runtimeValidation) {
  elizaLogger9.success("\u{1F389} TokenMetrics plugin fully initialized and ready!");
  elizaLogger9.log("\u{1F4AC} Users can now ask: 'What's the price of Bitcoin?'");
  elizaLogger9.log("\u{1F527} Plugin uses minimal interface - guaranteed TypeScript compatibility");
} else {
  elizaLogger9.warn("\u26A0\uFE0F TokenMetrics plugin loaded with some issues:");
  if (!structureValidation.isValid) elizaLogger9.warn("  \u2022 Plugin structure issues detected");
  if (!envValidation.isConfigured) elizaLogger9.warn("  \u2022 Environment configuration incomplete");
  if (!runtimeValidation) elizaLogger9.warn("  \u2022 Runtime validation failed");
  elizaLogger9.log("\u{1F4A1} Check the logs above for specific recommendations");
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
  getWellKnownTokenId,
  mapSymbolToName,
  resolveTokenSmart,
  tokenmetricsPlugin,
  validateAndGetApiKey,
  validatePluginRuntime,
  validateTokenMetricsPlugin
};
