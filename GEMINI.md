# Gemini Code Assistant Guide for this Astro Project

This document provides guidelines for developing in this repository with the help of a code assistant.

## Development Environment Setup

To get started, install the necessary dependencies using npm:

```bash
npm install
```

This will install all the packages listed in `package.json`, including Astro, TypeScript, and other required modules.

## Available Scripts

This project uses Astro, Vitest for component/unit testing, and Playwright for end-to-end testing. The following scripts are available in `package.json`:

-   **`npm run dev`**: Starts the development server with hot-reloading. This is the primary command you will use during development.
-   **`npm run build`**: Builds the static site for production to the `dist/` directory.
-   **`npm run preview`**: Runs a local server to preview the production build.
-   **`npm run check`**: A pre-flight check that builds the project, runs the TypeScript compiler to check for type errors, and performs a dry-run deployment with Wrangler to validate the configuration.
-   **`npm run test`**: Runs all Vitest unit and component tests.
-   **`npm run test:ui`**: Runs Vitest tests with the interactive UI.
-   **`npm run test:e2e`**: Runs all Playwright end-to-end tests.
-   **`npm run deploy`**: Deploys the website using Cloudflare Wrangler.
-   **`npm run cf-typegen`**: Generates TypeScript types for your Cloudflare Worker environment.

Always run `npm run check` and the relevant tests before committing changes to ensure everything is working correctly.

## Writing Tests

### Unit and Component Tests (Vitest)

-   **Framework**: Use **Vitest** (`describe`, `it`, `expect`) for testing individual components, functions, and logic.
-   **File Location**: Test files (`*.test.ts` or `*.test.js`) should be co-located with the source files they are testing. For example, a test for `src/components/Header.astro` would be `src/components/Header.test.ts`.
-   **Configuration**: Vitest is configured in `vitest.config.ts`.

### End-to-End Tests (Playwright)

-   **Framework**: Use **Playwright** to test the application from a user's perspective by simulating browser interactions.
-   **File Location**: E2E tests are located in the `tests/` directory at the root of the project. Test files should end with `.spec.ts`.
-   **Configuration**: Playwright is configured in `playwright.config.ts`.
-   **Running Tests**: E2E tests run against the production build of the site. The `test:e2e` script will automatically build and serve the site before running the tests.

## Project Structure

-   **`src/`**: Contains all the source code for the website.
    -   **`components/`**: Reusable Astro components (`.astro`).
    -   **`layouts/`**: Base layouts for pages.
    -   **`pages/`**: The pages of the website. Each file corresponds to a route.
    -   **`content/`**: Content collections, like blog posts (Markdown/MDX).
    -   **`styles/`**: Global CSS styles.
-   **`public/`**: Static assets that are copied directly to the build output directory.
-   **`tests/`**: Contains end-to-end tests written with Playwright.
-   **`astro.config.mjs`**: The main configuration file for Astro.
-   **`playwright.config.ts`**: Configuration file for Playwright.
-   **`vitest.config.ts`**: Configuration file for Vitest.
-   **`wrangler.json`**: Configuration file for Cloudflare Workers.
-   **`tsconfig.json`**: TypeScript configuration.

## TypeScript Usage

-   Leverage TypeScript's features for type safety.
-   Define types for props in Astro components and for any shared data structures.
-   Avoid using `any` where possible. Prefer `unknown` for values with truly unknown types and perform type narrowing.

## JavaScript/TypeScript

When contributing to this Astro, Node, and TypeScript codebase, please prioritize the use of plain JavaScript objects with accompanying TypeScript interface or type declarations over JavaScript class syntax. This approach offers significant advantages, especially concerning interoperability with Astro and overall code maintainability.

### Preferring Plain Objects over Classes

JavaScript classes, by their nature, are designed to encapsulate internal state and behavior. While this can be useful in some object-oriented paradigms, it often introduces unnecessary complexity and friction when working with Astro's component-based architecture. Here's why plain objects are preferred:

- Seamless Astro Integration: Astro components thrive on explicit props and state management. Classes' tendency to store internal state directly within instances can make prop and state propagation harder to reason about and maintain. Plain objects, on the other hand, are inherently immutable (when used thoughtfully) and can be easily passed as props, simplifying data flow and reducing unexpected side effects.

- Reduced Boilerplate and Increased Conciseness: Classes often promote the use of constructors, this binding, getters, setters, and other boilerplate that can unnecessarily bloat code. TypeScript interface and type declarations provide powerful static type checking without the runtime overhead or verbosity of class definitions. This allows for more succinct and readable code, aligning with JavaScript's strengths in functional programming.

- Enhanced Readability and Predictability: Plain objects, especially when their structure is clearly defined by TypeScript interfaces, are often easier to read and understand. Their properties are directly accessible, and there's no hidden internal state or complex inheritance chains to navigate. This predictability leads to fewer bugs and a more maintainable codebase.
  Simplified Immutability: While not strictly enforced, plain objects encourage an immutable approach to data. When you need to modify an object, you typically create a new one with the desired changes, rather than mutating the original. This pattern aligns perfectly with component-based architectures and helps prevent subtle bugs related to shared mutable state.

- Better Serialization and Deserialization: Plain JavaScript objects are naturally easy to serialize to JSON and deserialize back, which is a common requirement in web development (e.g., for API communication or local storage). Classes, with their methods and prototypes, can complicate this process.

### Embracing ES Module Syntax for Encapsulation

Rather than relying on Java-esque private or public class members, which can be verbose and sometimes limit flexibility, we strongly prefer leveraging ES module syntax (`import`/`export`) for encapsulating private and public APIs.

- Clearer Public API Definition: With ES modules, anything that is exported is part of the public API of that module, while anything not exported is inherently private to that module. This provides a very clear and explicit way to define what parts of your code are meant to be consumed by other modules.

- Enhanced Testability (Without Exposing Internals): By default, unexported functions or variables are not accessible from outside the module. This encourages you to test the public API of your modules, rather than their internal implementation details. If you find yourself needing to spy on or stub an unexported function for testing purposes, it's often a "code smell" indicating that the function might be a good candidate for extraction into its own separate, testable module with a well-defined public API. This promotes a more robust and maintainable testing strategy.

- Reduced Coupling: Explicitly defined module boundaries through import/export help reduce coupling between different parts of your codebase. This makes it easier to refactor, debug, and understand individual components in isolation.

### Avoiding `any` Types and Type Assertions; Preferring `unknown`

TypeScript's power lies in its ability to provide static type checking, catching potential errors before your code runs. To fully leverage this, it's crucial to avoid the `any` type and be judicious with type assertions.

- **The Dangers of `any`**: Using any effectively opts out of TypeScript's type checking for that particular variable or expression. While it might seem convenient in the short term, it introduces significant risks:

  - **Loss of Type Safety**: You lose all the benefits of type checking, making it easy to introduce runtime errors that TypeScript would otherwise have caught.
  - **Reduced Readability and Maintainability**: Code with `any` types is harder to understand and maintain, as the expected type of data is no longer explicitly defined.
  - **Masking Underlying Issues**: Often, the need for any indicates a deeper problem in the design of your code or the way you're interacting with external libraries. It's a sign that you might need to refine your types or refactor your code.

- **Preferring `unknown` over `any`**: When you absolutely cannot determine the type of a value at compile time, and you're tempted to reach for any, consider using unknown instead. unknown is a type-safe counterpart to any. While a variable of type unknown can hold any value, you must perform type narrowing (e.g., using typeof or instanceof checks, or a type assertion) before you can perform any operations on it. This forces you to handle the unknown type explicitly, preventing accidental runtime errors.

  ```
  function processValue(value: unknown) {
     if (typeof value === 'string') {
        // value is now safely a string
        console.log(value.toUpperCase());
     } else if (typeof value === 'number') {
        // value is now safely a number
        console.log(value * 2);
     }
     // Without narrowing, you cannot access properties or methods on 'value'
     // console.log(value.someProperty); // Error: Object is of type 'unknown'.
  }
  ```

- **Type Assertions (`as Type`) - Use with Caution**: Type assertions tell the TypeScript compiler, "Trust me, I know what I'm doing; this is definitely of this type." While there are legitimate use cases (e.g., when dealing with external libraries that don't have perfect type definitions, or when you have more information than the compiler), they should be used sparingly and with extreme caution.
  - **Bypassing Type Checking**: Like `any`, type assertions bypass TypeScript's safety checks. If your assertion is incorrect, you introduce a runtime error that TypeScript would not have warned you about.
  - **Code Smell in Testing**: A common scenario where `any` or type assertions might be tempting is when trying to test "private" implementation details (e.g., spying on or stubbing an unexported function within a module). This is a strong indication of a "code smell" in your testing strategy and potentially your code structure. Instead of trying to force access to private internals, consider whether those internal details should be refactored into a separate module with a well-defined public API. This makes them inherently testable without compromising encapsulation.

### Embracing JavaScript's Array Operators

To further enhance code cleanliness and promote safe functional programming practices, leverage JavaScript's rich set of array operators as much as possible. Methods like `.map()`, `.filter()`, `.reduce()`, `.slice()`, `.sort()`, and others are incredibly powerful for transforming and manipulating data collections in an immutable and declarative way.

Using these operators:

- Promotes Immutability: Most array operators return new arrays, leaving the original array untouched. This functional approach helps prevent unintended side effects and makes your code more predictable.
- Improves Readability: Chaining array operators often leads to more concise and expressive code than traditional for loops or imperative logic. The intent of the operation is clear at a glance.
- Facilitates Functional Programming: These operators are cornerstones of functional programming, encouraging the creation of pure functions that take inputs and produce outputs without causing side effects. This paradigm is highly beneficial for writing robust and testable code that pairs well with Astro.

By consistently applying these principles, we can maintain a codebase that is not only efficient and performant but also a joy to work with, both now and in the future.

## Git Repository

The main branch for this project is `main`. Please create feature branches from `main` for your work.

## Comments Policy

Only write high-value comments. Focus on the *why* behind complex code, not the *what*. Avoid leaving comments that are addressed to the user or the assistant.