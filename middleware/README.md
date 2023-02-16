#### CREATING MIDDLEWARES

- Create middleware file. Prepend `mw_` to indicate middleware
- Create middleware function. 1 function per file
- Append `_B` if middleware executes before main proc. `_A` if middleware executes after main proc

#### MIDDLEWARE FUNCTION

```sh
var mw_Logger_A = (req, res, next) => {
    next();
    console.log("=============================================");
    console.log(`END OF EXECUTION`);
    console.log("=============================================");
}
```

- Middleware makes use of 3 parameters, req, res, and next
- req : Holds request parameters
- res : Holds response parameters
- next : Callback for execution.
  > if `next()` is at the `start` of the middleware, middleware `executes first before executing main route`
  >
  > > if `next()` is at the `end` of the middleware, middleware `executes after the execution of the main route`

#### USING MIDDLEWARE

- for global middlewares, add the middleware in entrypoint.js in the project's root directory
- for specific middlewares, use callback to execute middleware
