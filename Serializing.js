function serializerReplacer(key, value) {
    return typeof value === "function" ? value.toString() : value;
}

function Serializer(obj) {
    return JSON.stringify(obj, serializerReplacer);
}

function deserialiserReplacer(key, value) {
    let fun = /^.{0,}\({1,}.{0,}\){1,}.{0,}\{{1,}.{0,}\}{1,}.{0,}$/s; // Regular functions
    let arrowFun = /^.{1,}=>.{1,}$/s; // Arrow functions
    let isFunction = fun.test(value) || arrowFun.test(value);
    return isFunction ? makeFunction(value) : value;
}

function makeFunction(value) {
    let firstBracesIndex = value.indexOf("{");
    let functionNameAndParameters = "";
    let body = "";
    if (firstBracesIndex != -1) {
        body = value.substring(firstBracesIndex + 1, value.lastIndexOf("}"))
        functionNameAndParameters = value.substring(0, firstBracesIndex)
    } else // Arrow function with expression (no curly braces)
    {
        let arrowIndex = value.indexOf("=>");
        body = "return " + value.substring(arrowIndex + 2);
        functionNameAndParameters = value.substring(0, arrowIndex)
    }
    let firstParenthesisIndex = functionNameAndParameters.indexOf("(");
    let argsTxt = "";
    if (firstParenthesisIndex != -1)
        argsTxt = functionNameAndParameters.substring(firstParenthesisIndex + 1, functionNameAndParameters.lastIndexOf(")"))
    else
        argsTxt = functionNameAndParameters;
    let unformattedArgsArray = argsTxt.split(",");
    let args = []
    for (let arg of unformattedArgsArray) {
        arg = arg.trim();
        args.push(arg);
    }
    let fun = Function.apply(0, args.concat(body));
    return fun;
}

function Deserializer(serializedObj) {
    return JSON.parse(serializedObj, deserialiserReplacer)
}

module.exports = {
    Serializer,
    Deserializer
};