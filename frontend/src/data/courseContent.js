// Evolva structured course content
// Original learning material for the Evolva project.
// AI features should personalize this content rather than regenerate it on every page load.

export const courseContent = {
  pythonPlacement: {
  "id": "python-placement",
  "title": "Python for Placement",
  "description": "A structured Python course covering fundamentals, problem solving, OOP, data structures, algorithms, and placement preparation.",
  "level": "Beginner to Intermediate",
  "category": "Programming",
  "modules": [
    {
      "id": "module-1",
      "title": "Python Introduction",
      "lessons": [
        {
          "id": "lesson-1",
          "title": "What is Python?",
          "slug": "what-is-python",
          "explanation": "Python is a high-level, general-purpose programming language known for readable syntax and a large ecosystem.",
          "code": "print('Hello, Python!')",
          "output": "Hello, Python!",
          "keyPoints": [
            "Python is interpreted and dynamically typed.",
            "Indentation defines code blocks.",
            "Python is widely used in web, data, automation, and AI."
          ],
          "practice": [
            "Write a small Python program related to what is python?.",
            "Create one edge-case test for what is python?.",
            "Explain the main idea of what is python? in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes What is Python??",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-2",
          "title": "Features of Python",
          "slug": "features-of-python",
          "explanation": "Python emphasizes readability, rapid development, and reusable libraries.",
          "code": "features = ['readable', 'dynamic', 'portable']\nprint(features)",
          "output": "['readable', 'dynamic', 'portable']",
          "keyPoints": [
            "Simple syntax",
            "Large standard library",
            "Cross-platform support"
          ],
          "practice": [
            "Write a small Python program related to features of python.",
            "Create one edge-case test for features of python.",
            "Explain the main idea of features of python in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Features of Python?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-3",
          "title": "Installing Python",
          "slug": "installing-python",
          "explanation": "Learn how to install Python and verify that the interpreter is available from a terminal.",
          "code": "import sys\nprint(sys.version_info.major)",
          "output": "3",
          "keyPoints": [
            "Use python --version to verify installation.",
            "A virtual environment isolates project dependencies."
          ],
          "practice": [
            "Write a small Python program related to installing python.",
            "Create one edge-case test for installing python.",
            "Explain the main idea of installing python in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Installing Python?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-4",
          "title": "First Python Program",
          "slug": "first-python-program",
          "explanation": "A Python program can contain expressions, statements, functions, and modules.",
          "code": "name = 'Evolva'\nprint('Welcome to', name)",
          "output": "Welcome to Evolva",
          "keyPoints": [
            "Execution starts with the top-level statements.",
            "print() writes values to standard output."
          ],
          "practice": [
            "Write a small Python program related to first python program.",
            "Create one edge-case test for first python program.",
            "Explain the main idea of first python program in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes First Python Program?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-5",
          "title": "Python Syntax",
          "slug": "python-syntax",
          "explanation": "Python uses indentation rather than braces to define blocks.",
          "code": "age = 20\nif age >= 18:\n    print('Adult')",
          "output": "Adult",
          "keyPoints": [
            "Keep indentation consistent.",
            "A colon introduces an indented block."
          ],
          "practice": [
            "Write a small Python program related to python syntax.",
            "Create one edge-case test for python syntax.",
            "Explain the main idea of python syntax in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Python Syntax?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-6",
          "title": "Comments and Documentation",
          "slug": "comments-and-documentation",
          "explanation": "Comments explain code to readers; docstrings document modules, classes, and functions.",
          "code": "# This is a comment\nprint('Learn Python')",
          "output": "Learn Python",
          "keyPoints": [
            "Use comments for intent, not obvious syntax.",
            "Triple-quoted strings are commonly used as docstrings."
          ],
          "practice": [
            "Write a small Python program related to comments and documentation.",
            "Create one edge-case test for comments and documentation.",
            "Explain the main idea of comments and documentation in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Comments and Documentation?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-2",
      "title": "Variables and Data Types",
      "lessons": [
        {
          "id": "lesson-7",
          "title": "Variables",
          "slug": "variables",
          "explanation": "A variable name refers to an object. Assignment binds a name to a value.",
          "code": "score = 95\nprint(score)",
          "output": "95",
          "keyPoints": [
            "Python variables do not need explicit type declarations.",
            "Names should be descriptive."
          ],
          "practice": [
            "Write a small Python program related to variables.",
            "Create one edge-case test for variables.",
            "Explain the main idea of variables in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Variables?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-8",
          "title": "Naming Rules",
          "slug": "naming-rules",
          "explanation": "Identifiers may contain letters, digits, and underscores but cannot start with a digit.",
          "code": "student_name = 'Kishor'\nprint(student_name)",
          "output": "Kishor",
          "keyPoints": [
            "Use snake_case for ordinary variables.",
            "Avoid shadowing built-in names such as list or str."
          ],
          "practice": [
            "Write a small Python program related to naming rules.",
            "Create one edge-case test for naming rules.",
            "Explain the main idea of naming rules in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Naming Rules?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-9",
          "title": "Integers and Floats",
          "slug": "integers-and-floats",
          "explanation": "Integers represent whole numbers and floats represent decimal values.",
          "code": "a = 10\nb = 2.5\nprint(a + b)",
          "output": "12.5",
          "keyPoints": [
            "Use int for whole numbers.",
            "Floating-point arithmetic can have representation details."
          ],
          "practice": [
            "Write a small Python program related to integers and floats.",
            "Create one edge-case test for integers and floats.",
            "Explain the main idea of integers and floats in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Integers and Floats?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-10",
          "title": "Strings",
          "slug": "strings",
          "explanation": "Strings are immutable sequences of Unicode characters.",
          "code": "text = 'Evolva'\nprint(text[0])",
          "output": "E",
          "keyPoints": [
            "Indexing starts at zero.",
            "Use slicing to obtain substrings."
          ],
          "practice": [
            "Write a small Python program related to strings.",
            "Create one edge-case test for strings.",
            "Explain the main idea of strings in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Strings?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-11",
          "title": "Booleans",
          "slug": "booleans",
          "explanation": "Boolean values are True and False and are central to conditional logic.",
          "code": "print(10 > 5)",
          "output": "True",
          "keyPoints": [
            "Comparisons produce Boolean values.",
            "and, or, and not combine Boolean expressions."
          ],
          "practice": [
            "Write a small Python program related to booleans.",
            "Create one edge-case test for booleans.",
            "Explain the main idea of booleans in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Booleans?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-12",
          "title": "Type Checking",
          "slug": "type-checking",
          "explanation": "Use type() to inspect an object's type and isinstance() for type-aware checks.",
          "code": "value = 42\nprint(type(value).__name__)",
          "output": "int",
          "keyPoints": [
            "isinstance() is usually better for validation.",
            "An object has a type even when the variable has no declaration."
          ],
          "practice": [
            "Write a small Python program related to type checking.",
            "Create one edge-case test for type checking.",
            "Explain the main idea of type checking in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Type Checking?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-13",
          "title": "Type Conversion",
          "slug": "type-conversion",
          "explanation": "Convert compatible values with constructors such as int(), float(), str(), and bool().",
          "code": "age = int('21')\nprint(age + 1)",
          "output": "22",
          "keyPoints": [
            "Invalid conversions raise exceptions.",
            "Be careful when converting non-numeric strings."
          ],
          "practice": [
            "Write a small Python program related to type conversion.",
            "Create one edge-case test for type conversion.",
            "Explain the main idea of type conversion in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Type Conversion?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-3",
      "title": "Operators",
      "lessons": [
        {
          "id": "lesson-14",
          "title": "Arithmetic Operators",
          "slug": "arithmetic-operators",
          "explanation": "Arithmetic operators perform numeric calculations.",
          "code": "a, b = 10, 3\nprint(a + b, a // b, a % b)",
          "output": "13 3 1",
          "keyPoints": [
            "// performs floor division.",
            "% returns the remainder.",
            "** performs exponentiation."
          ],
          "practice": [
            "Write a small Python program related to arithmetic operators.",
            "Create one edge-case test for arithmetic operators.",
            "Explain the main idea of arithmetic operators in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Arithmetic Operators?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-15",
          "title": "Assignment Operators",
          "slug": "assignment-operators",
          "explanation": "Assignment operators update a variable using a value or expression.",
          "code": "x = 10\nx += 5\nprint(x)",
          "output": "15",
          "keyPoints": [
            "+=, -=, *= and /= are common shortcuts.",
            "Assignment binds names; it does not copy objects automatically."
          ],
          "practice": [
            "Write a small Python program related to assignment operators.",
            "Create one edge-case test for assignment operators.",
            "Explain the main idea of assignment operators in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Assignment Operators?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-16",
          "title": "Comparison Operators",
          "slug": "comparison-operators",
          "explanation": "Comparison operators return Boolean results.",
          "code": "print(7 == 7, 7 != 3, 2 < 5)",
          "output": "True True True",
          "keyPoints": [
            "== compares values.",
            "is checks object identity and should not replace == for ordinary value comparisons."
          ],
          "practice": [
            "Write a small Python program related to comparison operators.",
            "Create one edge-case test for comparison operators.",
            "Explain the main idea of comparison operators in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Comparison Operators?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-17",
          "title": "Logical Operators",
          "slug": "logical-operators",
          "explanation": "and, or, and not combine conditions using short-circuit evaluation.",
          "code": "age = 22\nprint(age >= 18 and age <= 60)",
          "output": "True",
          "keyPoints": [
            "and stops when the left side is false.",
            "or stops when the left side is true."
          ],
          "practice": [
            "Write a small Python program related to logical operators.",
            "Create one edge-case test for logical operators.",
            "Explain the main idea of logical operators in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Logical Operators?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-18",
          "title": "Bitwise Operators",
          "slug": "bitwise-operators",
          "explanation": "Bitwise operators operate on integer bits.",
          "code": "a, b = 6, 3\nprint(a & b, a | b, a ^ b)",
          "output": "2 7 5",
          "keyPoints": [
            "& is bitwise AND.",
            "| is bitwise OR.",
            "^ is bitwise XOR."
          ],
          "practice": [
            "Write a small Python program related to bitwise operators.",
            "Create one edge-case test for bitwise operators.",
            "Explain the main idea of bitwise operators in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Bitwise Operators?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-19",
          "title": "Membership and Identity",
          "slug": "membership-and-identity",
          "explanation": "in tests membership while is tests whether two references point to the same object.",
          "code": "items = [1, 2, 3]\nprint(2 in items)",
          "output": "True",
          "keyPoints": [
            "Use in for membership.",
            "Use is for identity checks such as x is None."
          ],
          "practice": [
            "Write a small Python program related to membership and identity.",
            "Create one edge-case test for membership and identity.",
            "Explain the main idea of membership and identity in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Membership and Identity?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-4",
      "title": "Input and Output",
      "lessons": [
        {
          "id": "lesson-20",
          "title": "input()",
          "slug": "input",
          "explanation": "input() reads text from standard input and returns a string.",
          "code": "name = input('Name: ')\nprint('Hello', name)",
          "output": "Depends on user input",
          "keyPoints": [
            "Convert numeric input explicitly.",
            "Validate user input before processing."
          ],
          "practice": [
            "Write a small Python program related to input().",
            "Create one edge-case test for input().",
            "Explain the main idea of input() in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes input()?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-21",
          "title": "print()",
          "slug": "print",
          "explanation": "print() displays one or more values and supports separators and line endings.",
          "code": "print('Python', 'SQL', sep=' | ')",
          "output": "Python | SQL",
          "keyPoints": [
            "sep controls separators.",
            "end controls what is printed after the values."
          ],
          "practice": [
            "Write a small Python program related to print().",
            "Create one edge-case test for print().",
            "Explain the main idea of print() in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes print()?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-22",
          "title": "String Formatting",
          "slug": "string-formatting",
          "explanation": "Formatting lets you insert values into readable text.",
          "code": "name = 'Kishor'\nscore = 92\nprint(f'{name}: {score}')",
          "output": "Kishor: 92",
          "keyPoints": [
            "f-strings are concise and readable.",
            "Expressions can be placed inside braces."
          ],
          "practice": [
            "Write a small Python program related to string formatting.",
            "Create one edge-case test for string formatting.",
            "Explain the main idea of string formatting in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes String Formatting?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-23",
          "title": "Basic Input Programs",
          "slug": "basic-input-programs",
          "explanation": "Combine input, conversion, operators, and output to build small programs.",
          "code": "a = int(input())\nb = int(input())\nprint(a + b)",
          "output": "Sum of the two inputs",
          "keyPoints": [
            "Parse input deliberately.",
            "Keep calculation separate from presentation."
          ],
          "practice": [
            "Write a small Python program related to basic input programs.",
            "Create one edge-case test for basic input programs.",
            "Explain the main idea of basic input programs in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Basic Input Programs?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-5",
      "title": "Conditional Statements",
      "lessons": [
        {
          "id": "lesson-24",
          "title": "if Statement",
          "slug": "if-statement",
          "explanation": "Use if to execute a block when a condition is true.",
          "code": "marks = 75\nif marks >= 40:\n    print('Pass')",
          "output": "Pass",
          "keyPoints": [
            "The condition is evaluated as a Boolean.",
            "The block must be indented."
          ],
          "practice": [
            "Write a small Python program related to if statement.",
            "Create one edge-case test for if statement.",
            "Explain the main idea of if statement in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes if Statement?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-25",
          "title": "if-else",
          "slug": "if-else",
          "explanation": "else provides an alternative branch when the if condition is false.",
          "code": "age = 16\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')",
          "output": "Minor",
          "keyPoints": [
            "Exactly one branch executes in a simple if-else.",
            "Keep conditions readable."
          ],
          "practice": [
            "Write a small Python program related to if-else.",
            "Create one edge-case test for if-else.",
            "Explain the main idea of if-else in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes if-else?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-26",
          "title": "elif",
          "slug": "elif",
          "explanation": "elif allows multiple mutually exclusive conditions.",
          "code": "score = 82\nif score >= 90:\n    print('A')\nelif score >= 75:\n    print('B')\nelse:\n    print('C')",
          "output": "B",
          "keyPoints": [
            "Conditions are checked from top to bottom.",
            "Put more specific conditions before broader ones."
          ],
          "practice": [
            "Write a small Python program related to elif.",
            "Create one edge-case test for elif.",
            "Explain the main idea of elif in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes elif?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-27",
          "title": "Nested Conditions",
          "slug": "nested-conditions",
          "explanation": "A condition can contain another conditional block when decisions depend on multiple stages.",
          "code": "age = 21\nhas_id = True\nif age >= 18:\n    if has_id:\n        print('Allowed')",
          "output": "Allowed",
          "keyPoints": [
            "Avoid deeply nested conditions when a combined expression is clearer.",
            "Break complex logic into functions."
          ],
          "practice": [
            "Write a small Python program related to nested conditions.",
            "Create one edge-case test for nested conditions.",
            "Explain the main idea of nested conditions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Nested Conditions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-28",
          "title": "Conditional Expression",
          "slug": "conditional-expression",
          "explanation": "A conditional expression selects one of two values inline.",
          "code": "age = 20\nstatus = 'adult' if age >= 18 else 'minor'\nprint(status)",
          "output": "adult",
          "keyPoints": [
            "Use it for short expressions.",
            "Avoid hiding complex logic in one line."
          ],
          "practice": [
            "Write a small Python program related to conditional expression.",
            "Create one edge-case test for conditional expression.",
            "Explain the main idea of conditional expression in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Conditional Expression?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-6",
      "title": "Loops",
      "lessons": [
        {
          "id": "lesson-29",
          "title": "for Loop",
          "slug": "for-loop",
          "explanation": "for iterates over items in an iterable.",
          "code": "for n in [1, 2, 3]:\n    print(n)",
          "output": "1\n2\n3",
          "keyPoints": [
            "for works with lists, strings, ranges, and many other iterables.",
            "The loop variable receives each item."
          ],
          "practice": [
            "Write a small Python program related to for loop.",
            "Create one edge-case test for for loop.",
            "Explain the main idea of for loop in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes for Loop?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-30",
          "title": "range()",
          "slug": "range",
          "explanation": "range() generates an arithmetic progression commonly used for counting.",
          "code": "for i in range(1, 4):\n    print(i)",
          "output": "1\n2\n3",
          "keyPoints": [
            "The stop value is excluded.",
            "range(start, stop, step) is supported."
          ],
          "practice": [
            "Write a small Python program related to range().",
            "Create one edge-case test for range().",
            "Explain the main idea of range() in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes range()?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-31",
          "title": "while Loop",
          "slug": "while-loop",
          "explanation": "while repeats a block while its condition remains true.",
          "code": "n = 3\nwhile n > 0:\n    print(n)\n    n -= 1",
          "output": "3\n2\n1",
          "keyPoints": [
            "Update the state so the loop can terminate.",
            "Use while when repetition depends on a changing condition."
          ],
          "practice": [
            "Write a small Python program related to while loop.",
            "Create one edge-case test for while loop.",
            "Explain the main idea of while loop in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes while Loop?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-32",
          "title": "break",
          "slug": "break",
          "explanation": "break exits the nearest loop immediately.",
          "code": "for n in range(10):\n    if n == 3:\n        break\n    print(n)",
          "output": "0\n1\n2",
          "keyPoints": [
            "break is useful for early termination.",
            "Only the nearest loop is exited."
          ],
          "practice": [
            "Write a small Python program related to break.",
            "Create one edge-case test for break.",
            "Explain the main idea of break in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes break?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-33",
          "title": "continue",
          "slug": "continue",
          "explanation": "continue skips the rest of the current iteration.",
          "code": "for n in range(5):\n    if n == 2:\n        continue\n    print(n)",
          "output": "0\n1\n3\n4",
          "keyPoints": [
            "Use it to skip known cases.",
            "Avoid making control flow unnecessarily hard to follow."
          ],
          "practice": [
            "Write a small Python program related to continue.",
            "Create one edge-case test for continue.",
            "Explain the main idea of continue in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes continue?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-34",
          "title": "Nested Loops",
          "slug": "nested-loops",
          "explanation": "A loop can contain another loop, useful for grids and pair combinations.",
          "code": "for i in range(2):\n    for j in range(2):\n        print(i, j)",
          "output": "0 0\n0 1\n1 0\n1 1",
          "keyPoints": [
            "Nested loops can increase time complexity quickly.",
            "Look for better algorithms when input grows."
          ],
          "practice": [
            "Write a small Python program related to nested loops.",
            "Create one edge-case test for nested loops.",
            "Explain the main idea of nested loops in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Nested Loops?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-7",
      "title": "Strings",
      "lessons": [
        {
          "id": "lesson-35",
          "title": "Indexing",
          "slug": "indexing",
          "explanation": "String indexing retrieves a single character using a zero-based position.",
          "code": "word = 'Python'\nprint(word[1], word[-1])",
          "output": "y n",
          "keyPoints": [
            "Negative indexes count from the end.",
            "Strings are immutable."
          ],
          "practice": [
            "Write a small Python program related to indexing.",
            "Create one edge-case test for indexing.",
            "Explain the main idea of indexing in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Indexing?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-36",
          "title": "Slicing",
          "slug": "slicing",
          "explanation": "Slicing extracts a range using start:stop:step.",
          "code": "word = 'Python'\nprint(word[1:5])",
          "output": "ytho",
          "keyPoints": [
            "The stop index is excluded.",
            "word[::-1] reverses a string."
          ],
          "practice": [
            "Write a small Python program related to slicing.",
            "Create one edge-case test for slicing.",
            "Explain the main idea of slicing in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Slicing?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-37",
          "title": "String Methods",
          "slug": "string-methods",
          "explanation": "Methods such as lower(), upper(), strip(), replace(), and count() simplify text processing.",
          "code": "text = ' Python '\nprint(text.strip().lower())",
          "output": "python",
          "keyPoints": [
            "Methods return new strings because strings are immutable.",
            "Choose methods based on the required transformation."
          ],
          "practice": [
            "Write a small Python program related to string methods.",
            "Create one edge-case test for string methods.",
            "Explain the main idea of string methods in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes String Methods?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-38",
          "title": "split() and join()",
          "slug": "split---and-join",
          "explanation": "split() turns text into pieces and join() combines strings with a separator.",
          "code": "parts = 'python sql ai'.split()\nprint('-'.join(parts))",
          "output": "python-sql-ai",
          "keyPoints": [
            "split() defaults to whitespace.",
            "join() expects an iterable of strings."
          ],
          "practice": [
            "Write a small Python program related to split() and join().",
            "Create one edge-case test for split() and join().",
            "Explain the main idea of split() and join() in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes split() and join()?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-39",
          "title": "String Searching",
          "slug": "string-searching",
          "explanation": "find(), index(), startswith(), endswith(), and in help locate text.",
          "code": "text = 'hello python'\nprint('python' in text)",
          "output": "True",
          "keyPoints": [
            "in is simple for membership.",
            "find() returns -1 when the substring is absent."
          ],
          "practice": [
            "Write a small Python program related to string searching.",
            "Create one edge-case test for string searching.",
            "Explain the main idea of string searching in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes String Searching?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-40",
          "title": "String Coding Problems",
          "slug": "string-coding-problems",
          "explanation": "Practice palindrome, frequency, reverse, and substring problems using core string operations.",
          "code": "s = 'level'\nprint(s == s[::-1])",
          "output": "True",
          "keyPoints": [
            "Understand both direct methods and algorithmic approaches.",
            "Consider time and space complexity."
          ],
          "practice": [
            "Write a small Python program related to string coding problems.",
            "Create one edge-case test for string coding problems.",
            "Explain the main idea of string coding problems in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes String Coding Problems?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-8",
      "title": "Lists",
      "lessons": [
        {
          "id": "lesson-41",
          "title": "Creating Lists",
          "slug": "creating-lists",
          "explanation": "Lists are ordered, mutable collections that can contain values of different types.",
          "code": "numbers = [10, 20, 30]\nprint(numbers)",
          "output": "[10, 20, 30]",
          "keyPoints": [
            "Lists preserve insertion order.",
            "Duplicates are allowed."
          ],
          "practice": [
            "Write a small Python program related to creating lists.",
            "Create one edge-case test for creating lists.",
            "Explain the main idea of creating lists in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Creating Lists?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-42",
          "title": "List Indexing and Slicing",
          "slug": "list-indexing-and-slicing",
          "explanation": "Use indexes and slices to access list elements and ranges.",
          "code": "a = [10, 20, 30, 40]\nprint(a[1:3])",
          "output": "[20, 30]",
          "keyPoints": [
            "Slices create a new list.",
            "Negative indexes count from the end."
          ],
          "practice": [
            "Write a small Python program related to list indexing and slicing.",
            "Create one edge-case test for list indexing and slicing.",
            "Explain the main idea of list indexing and slicing in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes List Indexing and Slicing?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-43",
          "title": "List Methods",
          "slug": "list-methods",
          "explanation": "append(), extend(), insert(), remove(), pop(), clear(), and copy() support common operations.",
          "code": "a = [1, 2]\na.append(3)\nprint(a)",
          "output": "[1, 2, 3]",
          "keyPoints": [
            "append adds one item.",
            "extend adds elements from an iterable."
          ],
          "practice": [
            "Write a small Python program related to list methods.",
            "Create one edge-case test for list methods.",
            "Explain the main idea of list methods in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes List Methods?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-44",
          "title": "Sorting Lists",
          "slug": "sorting-lists",
          "explanation": "sort() changes a list in place while sorted() returns a new sorted list.",
          "code": "a = [3, 1, 2]\nprint(sorted(a))",
          "output": "[1, 2, 3]",
          "keyPoints": [
            "Use key= for custom sorting.",
            "Sorting is generally O(n log n)."
          ],
          "practice": [
            "Write a small Python program related to sorting lists.",
            "Create one edge-case test for sorting lists.",
            "Explain the main idea of sorting lists in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Sorting Lists?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-45",
          "title": "Nested Lists",
          "slug": "nested-lists",
          "explanation": "Lists can contain other lists and represent tables or matrices.",
          "code": "matrix = [[1, 2], [3, 4]]\nprint(matrix[1][0])",
          "output": "3",
          "keyPoints": [
            "Use nested indexing carefully.",
            "For numerical workloads, specialized libraries may be more efficient."
          ],
          "practice": [
            "Write a small Python program related to nested lists.",
            "Create one edge-case test for nested lists.",
            "Explain the main idea of nested lists in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Nested Lists?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-46",
          "title": "List Comprehensions",
          "slug": "list-comprehensions",
          "explanation": "List comprehensions provide concise syntax for transforming and filtering iterables.",
          "code": "squares = [x*x for x in range(5)]\nprint(squares)",
          "output": "[0, 1, 4, 9, 16]",
          "keyPoints": [
            "Keep comprehensions readable.",
            "A normal loop is fine when logic becomes complex."
          ],
          "practice": [
            "Write a small Python program related to list comprehensions.",
            "Create one edge-case test for list comprehensions.",
            "Explain the main idea of list comprehensions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes List Comprehensions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-9",
      "title": "Tuples Sets Dictionaries",
      "lessons": [
        {
          "id": "lesson-47",
          "title": "Tuples",
          "slug": "tuples",
          "explanation": "Tuples are ordered immutable sequences.",
          "code": "point = (10, 20)\nprint(point[0])",
          "output": "10",
          "keyPoints": [
            "Tuples can be unpacked.",
            "Immutable tuples can be used as dictionary keys when their elements are hashable."
          ],
          "practice": [
            "Write a small Python program related to tuples.",
            "Create one edge-case test for tuples.",
            "Explain the main idea of tuples in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Tuples?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-48",
          "title": "Sets",
          "slug": "sets",
          "explanation": "Sets store unique hashable elements and support fast membership testing.",
          "code": "nums = {1, 2, 2, 3}\nprint(sorted(nums))",
          "output": "[1, 2, 3]",
          "keyPoints": [
            "Sets remove duplicates.",
            "Set elements must be hashable."
          ],
          "practice": [
            "Write a small Python program related to sets.",
            "Create one edge-case test for sets.",
            "Explain the main idea of sets in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Sets?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-49",
          "title": "Set Operations",
          "slug": "set-operations",
          "explanation": "Union, intersection, difference, and symmetric difference model common set relationships.",
          "code": "a = {1,2,3}\nb = {2,3,4}\nprint(sorted(a & b))",
          "output": "[2, 3]",
          "keyPoints": [
            "& is intersection.",
            "| is union.",
            "- is difference."
          ],
          "practice": [
            "Write a small Python program related to set operations.",
            "Create one edge-case test for set operations.",
            "Explain the main idea of set operations in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Set Operations?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-50",
          "title": "Dictionaries",
          "slug": "dictionaries",
          "explanation": "Dictionaries map hashable keys to values.",
          "code": "student = {'name': 'Kishor', 'score': 90}\nprint(student['score'])",
          "output": "90",
          "keyPoints": [
            "Keys are unique.",
            "Use get() when a missing key should be handled safely."
          ],
          "practice": [
            "Write a small Python program related to dictionaries.",
            "Create one edge-case test for dictionaries.",
            "Explain the main idea of dictionaries in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Dictionaries?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-51",
          "title": "Dictionary Methods",
          "slug": "dictionary-methods",
          "explanation": "get(), keys(), values(), items(), update(), pop(), and setdefault() support dictionary operations.",
          "code": "d = {'a': 1}\nd.update({'b': 2})\nprint(d)",
          "output": "{'a': 1, 'b': 2}",
          "keyPoints": [
            "items() is useful for iteration.",
            "Avoid changing dictionary size while directly iterating over it."
          ],
          "practice": [
            "Write a small Python program related to dictionary methods.",
            "Create one edge-case test for dictionary methods.",
            "Explain the main idea of dictionary methods in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Dictionary Methods?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-52",
          "title": "Comprehensions",
          "slug": "comprehensions",
          "explanation": "Dictionary and set comprehensions build collections from iterables.",
          "code": "squares = {x: x*x for x in range(3)}\nprint(squares)",
          "output": "{0: 0, 1: 1, 2: 4}",
          "keyPoints": [
            "Use comprehensions for simple transformations.",
            "Prefer explicit loops for complex logic."
          ],
          "practice": [
            "Write a small Python program related to comprehensions.",
            "Create one edge-case test for comprehensions.",
            "Explain the main idea of comprehensions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Comprehensions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-10",
      "title": "Functions",
      "lessons": [
        {
          "id": "lesson-53",
          "title": "Defining Functions",
          "slug": "defining-functions",
          "explanation": "Functions package reusable logic behind a named interface.",
          "code": "def greet(name):\n    return f'Hello {name}'\nprint(greet('Kishor'))",
          "output": "Hello Kishor",
          "keyPoints": [
            "Use descriptive names.",
            "Return values when callers need results."
          ],
          "practice": [
            "Write a small Python program related to defining functions.",
            "Create one edge-case test for defining functions.",
            "Explain the main idea of defining functions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Defining Functions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-54",
          "title": "Parameters and Arguments",
          "slug": "parameters-and-arguments",
          "explanation": "Parameters define a function interface and arguments provide actual values.",
          "code": "def add(a, b):\n    return a + b\nprint(add(2, 3))",
          "output": "5",
          "keyPoints": [
            "Positional and keyword arguments are supported.",
            "Keep function responsibilities focused."
          ],
          "practice": [
            "Write a small Python program related to parameters and arguments.",
            "Create one edge-case test for parameters and arguments.",
            "Explain the main idea of parameters and arguments in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Parameters and Arguments?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-55",
          "title": "Default Arguments",
          "slug": "default-arguments",
          "explanation": "Default values are used when callers omit optional arguments.",
          "code": "def greet(name='User'):\n    print(name)\ngreet()",
          "output": "User",
          "keyPoints": [
            "Defaults are evaluated when the function is defined.",
            "Avoid mutable default arguments such as []."
          ],
          "practice": [
            "Write a small Python program related to default arguments.",
            "Create one edge-case test for default arguments.",
            "Explain the main idea of default arguments in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Default Arguments?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-56",
          "title": "Variable-Length Arguments",
          "slug": "variable-length-arguments",
          "explanation": "*args collects positional arguments and **kwargs collects keyword arguments.",
          "code": "def total(*nums):\n    return sum(nums)\nprint(total(1,2,3))",
          "output": "6",
          "keyPoints": [
            "Use *args for flexible positional input.",
            "Use **kwargs for flexible named options."
          ],
          "practice": [
            "Write a small Python program related to variable-length arguments.",
            "Create one edge-case test for variable-length arguments.",
            "Explain the main idea of variable-length arguments in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Variable-Length Arguments?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-57",
          "title": "Scope",
          "slug": "scope",
          "explanation": "Python resolves names through local, enclosing, global, and built-in scopes.",
          "code": "x = 10\ndef show():\n    x = 20\n    print(x)\nshow()",
          "output": "20",
          "keyPoints": [
            "Prefer passing data rather than relying on globals.",
            "nonlocal and global exist for specific use cases."
          ],
          "practice": [
            "Write a small Python program related to scope.",
            "Create one edge-case test for scope.",
            "Explain the main idea of scope in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Scope?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-58",
          "title": "Lambda Functions",
          "slug": "lambda-functions",
          "explanation": "Lambda expressions create small anonymous functions.",
          "code": "double = lambda x: x * 2\nprint(double(4))",
          "output": "8",
          "keyPoints": [
            "Use lambda for short expressions.",
            "Use def when a function needs explanation or multiple statements."
          ],
          "practice": [
            "Write a small Python program related to lambda functions.",
            "Create one edge-case test for lambda functions.",
            "Explain the main idea of lambda functions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Lambda Functions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-59",
          "title": "map and filter",
          "slug": "map-and-filter",
          "explanation": "map transforms items and filter selects items according to a predicate.",
          "code": "nums = [1,2,3,4]\nprint(list(map(lambda x:x*x, nums)))",
          "output": "[1, 4, 9, 16]",
          "keyPoints": [
            "Both return lazy iterators in Python 3.",
            "Comprehensions are often clearer."
          ],
          "practice": [
            "Write a small Python program related to map and filter.",
            "Create one edge-case test for map and filter.",
            "Explain the main idea of map and filter in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes map and filter?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-60",
          "title": "Recursion Basics",
          "slug": "recursion-basics",
          "explanation": "Recursion solves a problem by reducing it to smaller instances of itself.",
          "code": "def fact(n):\n    return 1 if n <= 1 else n * fact(n-1)\nprint(fact(5))",
          "output": "120",
          "keyPoints": [
            "Every recursion needs a base case.",
            "Deep recursion can hit Python's recursion limit."
          ],
          "practice": [
            "Write a small Python program related to recursion basics.",
            "Create one edge-case test for recursion basics.",
            "Explain the main idea of recursion basics in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Recursion Basics?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-11",
      "title": "OOP",
      "lessons": [
        {
          "id": "lesson-61",
          "title": "Classes and Objects",
          "slug": "classes-and-objects",
          "explanation": "A class defines a structure and behavior; an object is an instance of that class.",
          "code": "class Student:\n    pass\ns = Student()\nprint(type(s).__name__)",
          "output": "Student",
          "keyPoints": [
            "Classes model related data and behavior.",
            "Objects are created by calling the class."
          ],
          "practice": [
            "Write a small Python program related to classes and objects.",
            "Create one edge-case test for classes and objects.",
            "Explain the main idea of classes and objects in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Classes and Objects?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-62",
          "title": "Constructors",
          "slug": "constructors",
          "explanation": "__init__ initializes instance state when an object is created.",
          "code": "class Student:\n    def __init__(self, name):\n        self.name = name\ns = Student('Kishor')\nprint(s.name)",
          "output": "Kishor",
          "keyPoints": [
            "self refers to the current instance.",
            "__init__ is not the object allocator itself."
          ],
          "practice": [
            "Write a small Python program related to constructors.",
            "Create one edge-case test for constructors.",
            "Explain the main idea of constructors in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Constructors?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-63",
          "title": "Instance Methods",
          "slug": "instance-methods",
          "explanation": "Methods operate on instance data and receive self as their first parameter.",
          "code": "class Counter:\n    def __init__(self): self.value = 0\n    def inc(self): self.value += 1\nc = Counter(); c.inc(); print(c.value)",
          "output": "1",
          "keyPoints": [
            "Keep object state coherent.",
            "Methods can return values instead of only printing."
          ],
          "practice": [
            "Write a small Python program related to instance methods.",
            "Create one edge-case test for instance methods.",
            "Explain the main idea of instance methods in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Instance Methods?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-64",
          "title": "Encapsulation",
          "slug": "encapsulation",
          "explanation": "Encapsulation organizes data and operations behind a class interface.",
          "code": "class Bank:\n    def __init__(self): self._balance = 0\nb = Bank(); b._balance += 100; print(b._balance)",
          "output": "100",
          "keyPoints": [
            "A leading underscore communicates intended internal use.",
            "Python does not enforce private fields in the same way as some languages."
          ],
          "practice": [
            "Write a small Python program related to encapsulation.",
            "Create one edge-case test for encapsulation.",
            "Explain the main idea of encapsulation in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Encapsulation?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-65",
          "title": "Inheritance",
          "slug": "inheritance",
          "explanation": "Inheritance allows a class to reuse and extend behavior from a parent class.",
          "code": "class Animal:\n    def speak(self): return 'sound'\nclass Dog(Animal): pass\nprint(Dog().speak())",
          "output": "sound",
          "keyPoints": [
            "Use inheritance for genuine is-a relationships.",
            "Composition is often preferable for flexible designs."
          ],
          "practice": [
            "Write a small Python program related to inheritance.",
            "Create one edge-case test for inheritance.",
            "Explain the main idea of inheritance in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Inheritance?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-66",
          "title": "Polymorphism",
          "slug": "polymorphism",
          "explanation": "Different objects can support the same interface while implementing behavior differently.",
          "code": "class Cat:\n    def speak(self): return 'meow'\nclass Dog:\n    def speak(self): return 'woof'\nfor a in [Cat(), Dog()]: print(a.speak())",
          "output": "meow\nwoof",
          "keyPoints": [
            "Duck typing is common in Python.",
            "Code to behavior rather than concrete types when practical."
          ],
          "practice": [
            "Write a small Python program related to polymorphism.",
            "Create one edge-case test for polymorphism.",
            "Explain the main idea of polymorphism in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Polymorphism?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-67",
          "title": "Abstraction",
          "slug": "abstraction",
          "explanation": "Abstraction exposes essential operations while hiding implementation details.",
          "code": "from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self): pass\nprint(Shape.__abstractmethods__)",
          "output": "frozenset({'area'})",
          "keyPoints": [
            "Abstract classes define required interfaces.",
            "Keep abstractions focused on stable behavior."
          ],
          "practice": [
            "Write a small Python program related to abstraction.",
            "Create one edge-case test for abstraction.",
            "Explain the main idea of abstraction in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Abstraction?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-12",
      "title": "Exceptions and Files",
      "lessons": [
        {
          "id": "lesson-68",
          "title": "Errors vs Exceptions",
          "slug": "errors-vs-exceptions",
          "explanation": "Exceptions represent runtime conditions that can be handled or propagated.",
          "code": "try:\n    print(10 / 0)\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')",
          "output": "Cannot divide by zero",
          "keyPoints": [
            "Catch specific exceptions.",
            "Don't silently swallow unexpected failures."
          ],
          "practice": [
            "Write a small Python program related to errors vs exceptions.",
            "Create one edge-case test for errors vs exceptions.",
            "Explain the main idea of errors vs exceptions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Errors vs Exceptions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-69",
          "title": "try and except",
          "slug": "try-and-except",
          "explanation": "try contains risky code and except handles selected exceptions.",
          "code": "try:\n    value = int('abc')\nexcept ValueError:\n    print('Invalid number')",
          "output": "Invalid number",
          "keyPoints": [
            "Keep the try block small.",
            "Use exception messages to diagnose failures."
          ],
          "practice": [
            "Write a small Python program related to try and except.",
            "Create one edge-case test for try and except.",
            "Explain the main idea of try and except in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes try and except?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-70",
          "title": "finally",
          "slug": "finally",
          "explanation": "finally runs whether an exception occurs or not.",
          "code": "try:\n    print('work')\nfinally:\n    print('cleanup')",
          "output": "work\ncleanup",
          "keyPoints": [
            "Use finally for cleanup.",
            "Context managers are often better for resources."
          ],
          "practice": [
            "Write a small Python program related to finally.",
            "Create one edge-case test for finally.",
            "Explain the main idea of finally in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes finally?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-71",
          "title": "raise",
          "slug": "raise",
          "explanation": "raise explicitly creates an exception when a condition is invalid.",
          "code": "age = -1\nif age < 0:\n    raise ValueError('age cannot be negative')",
          "output": "ValueError",
          "keyPoints": [
            "Raise meaningful exception types.",
            "Validate inputs at boundaries."
          ],
          "practice": [
            "Write a small Python program related to raise.",
            "Create one edge-case test for raise.",
            "Explain the main idea of raise in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes raise?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-72",
          "title": "Reading Files",
          "slug": "reading-files",
          "explanation": "open() can read text files and should usually be used with a context manager.",
          "code": "from io import StringIO\nf = StringIO('hello')\nprint(f.read())",
          "output": "hello",
          "keyPoints": [
            "with automatically closes real file handles.",
            "Specify encoding for text files when appropriate."
          ],
          "practice": [
            "Write a small Python program related to reading files.",
            "Create one edge-case test for reading files.",
            "Explain the main idea of reading files in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Reading Files?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-73",
          "title": "Writing Files",
          "slug": "writing-files",
          "explanation": "Files can be opened in write or append mode to persist text.",
          "code": "from io import StringIO\nf = StringIO(); f.write('Evolva'); print(f.getvalue())",
          "output": "Evolva",
          "keyPoints": [
            "w replaces existing content.",
            "a appends content."
          ],
          "practice": [
            "Write a small Python program related to writing files.",
            "Create one edge-case test for writing files.",
            "Explain the main idea of writing files in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Writing Files?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-74",
          "title": "with Statement",
          "slug": "with-statement",
          "explanation": "Context managers guarantee resource cleanup when leaving a block.",
          "code": "from io import StringIO\nwith StringIO('abc') as f:\n    print(f.read())",
          "output": "abc",
          "keyPoints": [
            "with is the preferred pattern for file resources.",
            "Context managers can manage many resources beyond files."
          ],
          "practice": [
            "Write a small Python program related to with statement.",
            "Create one edge-case test for with statement.",
            "Explain the main idea of with statement in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes with Statement?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-13",
      "title": "Modules and Packages",
      "lessons": [
        {
          "id": "lesson-75",
          "title": "import",
          "slug": "import",
          "explanation": "Modules let you organize reusable Python code.",
          "code": "import math\nprint(math.sqrt(16))",
          "output": "4.0",
          "keyPoints": [
            "Import only what you need when appropriate.",
            "Use aliases to improve readability for long module names."
          ],
          "practice": [
            "Write a small Python program related to import.",
            "Create one edge-case test for import.",
            "Explain the main idea of import in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes import?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-76",
          "title": "Standard Library",
          "slug": "standard-library",
          "explanation": "Python ships with modules for common tasks such as math, datetime, collections, pathlib, and json.",
          "code": "from collections import Counter\nprint(Counter('banana').most_common(1))",
          "output": "[('a', 3)]",
          "keyPoints": [
            "Learn the standard library before adding dependencies.",
            "collections is especially useful for interview problems."
          ],
          "practice": [
            "Write a small Python program related to standard library.",
            "Create one edge-case test for standard library.",
            "Explain the main idea of standard library in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Standard Library?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-77",
          "title": "Creating Modules",
          "slug": "creating-modules",
          "explanation": "Any .py file can serve as a module when imported from a suitable path.",
          "code": "module_name = 'utils'\nprint(module_name)",
          "output": "utils",
          "keyPoints": [
            "Keep modules cohesive.",
            "Use if __name__ == '__main__' for executable module code."
          ],
          "practice": [
            "Write a small Python program related to creating modules.",
            "Create one edge-case test for creating modules.",
            "Explain the main idea of creating modules in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Creating Modules?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-78",
          "title": "Packages",
          "slug": "packages",
          "explanation": "Packages group related modules into a reusable structure.",
          "code": "package = 'evolva.course'\nprint(package)",
          "output": "evolva.course",
          "keyPoints": [
            "Packages help scale larger applications.",
            "Use clear module boundaries."
          ],
          "practice": [
            "Write a small Python program related to packages.",
            "Create one edge-case test for packages.",
            "Explain the main idea of packages in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Packages?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-79",
          "title": "pip and Environments",
          "slug": "pip-and-environments",
          "explanation": "pip installs Python packages and virtual environments isolate dependencies.",
          "code": "print('python -m pip install package-name')",
          "output": "Command shown",
          "keyPoints": [
            "Prefer python -m pip to target the intended interpreter.",
            "Pin dependencies for reproducible projects."
          ],
          "practice": [
            "Write a small Python program related to pip and environments.",
            "Create one edge-case test for pip and environments.",
            "Explain the main idea of pip and environments in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes pip and Environments?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-14",
      "title": "Data Structures and Algorithms",
      "lessons": [
        {
          "id": "lesson-80",
          "title": "Stack",
          "slug": "stack",
          "explanation": "A stack follows LIFO order. Python lists can implement basic stacks efficiently.",
          "code": "stack = []\nstack.append(10); stack.append(20)\nprint(stack.pop())",
          "output": "20",
          "keyPoints": [
            "push maps to append.",
            "pop removes the newest item."
          ],
          "practice": [
            "Write a small Python program related to stack.",
            "Create one edge-case test for stack.",
            "Explain the main idea of stack in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Stack?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-81",
          "title": "Queue",
          "slug": "queue",
          "explanation": "A queue follows FIFO order. collections.deque supports efficient operations at both ends.",
          "code": "from collections import deque\nq = deque([1,2]); q.append(3); print(q.popleft())",
          "output": "1",
          "keyPoints": [
            "Avoid pop(0) on lists for large queues.",
            "deque is designed for efficient end operations."
          ],
          "practice": [
            "Write a small Python program related to queue.",
            "Create one edge-case test for queue.",
            "Explain the main idea of queue in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Queue?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-82",
          "title": "Frequency Counting",
          "slug": "frequency-counting",
          "explanation": "Frequency maps count occurrences and are common in string and array problems.",
          "code": "from collections import Counter\nprint(Counter('aabbc'))",
          "output": "Counter({'a': 2, 'b': 2, 'c': 1})",
          "keyPoints": [
            "Hash maps give average constant-time counting.",
            "Choose the simplest structure that fits."
          ],
          "practice": [
            "Write a small Python program related to frequency counting.",
            "Create one edge-case test for frequency counting.",
            "Explain the main idea of frequency counting in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Frequency Counting?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-83",
          "title": "Linear Search",
          "slug": "linear-search",
          "explanation": "Linear search checks items sequentially and works on unsorted data.",
          "code": "a = [4,7,2,9]\ntarget = 2\nprint(a.index(target))",
          "output": "2",
          "keyPoints": [
            "Time complexity is O(n).",
            "It is often optimal when data is small or unsorted."
          ],
          "practice": [
            "Write a small Python program related to linear search.",
            "Create one edge-case test for linear search.",
            "Explain the main idea of linear search in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Linear Search?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-84",
          "title": "Binary Search",
          "slug": "binary-search",
          "explanation": "Binary search repeatedly halves a sorted search space.",
          "code": "import bisect\na = [1,3,5,7]\nprint(bisect.bisect_left(a, 5))",
          "output": "2",
          "keyPoints": [
            "The data must satisfy the ordering assumption.",
            "Time complexity is O(log n)."
          ],
          "practice": [
            "Write a small Python program related to binary search.",
            "Create one edge-case test for binary search.",
            "Explain the main idea of binary search in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Binary Search?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-85",
          "title": "Sorting",
          "slug": "sorting",
          "explanation": "Sorting arranges data according to an ordering and is a building block for many algorithms.",
          "code": "a = [5,1,4,2]\na.sort()\nprint(a)",
          "output": "[1, 2, 4, 5]",
          "keyPoints": [
            "Python's sort is stable.",
            "Sorting often simplifies subsequent searching or grouping."
          ],
          "practice": [
            "Write a small Python program related to sorting.",
            "Create one edge-case test for sorting.",
            "Explain the main idea of sorting in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Sorting?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-86",
          "title": "Time Complexity",
          "slug": "time-complexity",
          "explanation": "Big-O describes how resource usage grows as input size increases.",
          "code": "def find_first(a):\n    return a[0] if a else None\nprint(find_first([1,2,3]))",
          "output": "1",
          "keyPoints": [
            "A single indexed access is O(1).",
            "Nested loops often produce O(n²), but always analyze the actual operations."
          ],
          "practice": [
            "Write a small Python program related to time complexity.",
            "Create one edge-case test for time complexity.",
            "Explain the main idea of time complexity in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Time Complexity?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-15",
      "title": "Problem Solving Patterns",
      "lessons": [
        {
          "id": "lesson-87",
          "title": "Two Pointers",
          "slug": "two-pointers",
          "explanation": "Two pointers traverse an array from two positions and can reduce quadratic scans.",
          "code": "a = [1,2,3,4,6]\ni, j = 0, len(a)-1\ntarget = 7\nwhile i < j:\n    s = a[i] + a[j]\n    if s == target: break\n    if s < target: i += 1\n    else: j -= 1\nprint(a[i], a[j])",
          "output": "1 6",
          "keyPoints": [
            "Usually requires sorted data for the classic pair-sum pattern.",
            "Often reduces O(n²) to O(n)."
          ],
          "practice": [
            "Write a small Python program related to two pointers.",
            "Create one edge-case test for two pointers.",
            "Explain the main idea of two pointers in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Two Pointers?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-88",
          "title": "Sliding Window",
          "slug": "sliding-window",
          "explanation": "Sliding windows maintain information about a moving contiguous range.",
          "code": "a = [1,2,3,4]\nk = 2\nprint(max(a[i]+a[i+1] for i in range(len(a)-1)))",
          "output": "7",
          "keyPoints": [
            "Useful for contiguous subarray or substring problems.",
            "Maintain the window incrementally when possible."
          ],
          "practice": [
            "Write a small Python program related to sliding window.",
            "Create one edge-case test for sliding window.",
            "Explain the main idea of sliding window in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Sliding Window?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-89",
          "title": "Prefix Sum",
          "slug": "prefix-sum",
          "explanation": "Prefix sums allow repeated range-sum queries after linear preprocessing.",
          "code": "a = [2,4,1,3]\np = [0]\nfor x in a: p.append(p[-1]+x)\nprint(p[3]-p[1])",
          "output": "5",
          "keyPoints": [
            "Range sum from l to r can be answered using prefix differences.",
            "Preprocessing trades space/time upfront for faster queries."
          ],
          "practice": [
            "Write a small Python program related to prefix sum.",
            "Create one edge-case test for prefix sum.",
            "Explain the main idea of prefix sum in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Prefix Sum?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-90",
          "title": "Hashing",
          "slug": "hashing",
          "explanation": "Hash-based structures support fast average-case membership and lookup.",
          "code": "seen = set([2,4,6])\nprint(4 in seen)",
          "output": "True",
          "keyPoints": [
            "Sets and dictionaries are common interview tools.",
            "Worst-case complexity can differ from average-case assumptions."
          ],
          "practice": [
            "Write a small Python program related to hashing.",
            "Create one edge-case test for hashing.",
            "Explain the main idea of hashing in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Hashing?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-91",
          "title": "Stack Patterns",
          "slug": "stack-patterns",
          "explanation": "Stacks help with nested structures, matching brackets, and monotonic patterns.",
          "code": "pairs = {')':'(', ']':'[', '}':'{'}\nstack=[]\nfor ch in '([])':\n    if ch in '([{': stack.append(ch)\n    elif not stack or stack.pop()!=pairs[ch]: print('invalid')\nprint(not stack)",
          "output": "True",
          "keyPoints": [
            "Think about what must be remembered until a later element appears.",
            "Monotonic stacks solve many next-greater-element problems."
          ],
          "practice": [
            "Write a small Python program related to stack patterns.",
            "Create one edge-case test for stack patterns.",
            "Explain the main idea of stack patterns in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Stack Patterns?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-92",
          "title": "Recursion Patterns",
          "slug": "recursion-patterns",
          "explanation": "Recursive decomposition is useful for trees, backtracking, divide-and-conquer, and combinatorial search.",
          "code": "def countdown(n):\n    if n == 0: return 0\n    return 1 + countdown(n-1)\nprint(countdown(4))",
          "output": "4",
          "keyPoints": [
            "Define a smaller subproblem.",
            "Always prove that recursion reaches a base case."
          ],
          "practice": [
            "Write a small Python program related to recursion patterns.",
            "Create one edge-case test for recursion patterns.",
            "Explain the main idea of recursion patterns in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Recursion Patterns?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    },
    {
      "id": "module-16",
      "title": "Placement Preparation",
      "lessons": [
        {
          "id": "lesson-93",
          "title": "Easy Coding Problems",
          "slug": "easy-coding-problems",
          "explanation": "Start with array, string, counting, and basic math problems to build speed.",
          "code": "nums = [3, 1, 4, 1, 5]\nprint(max(nums))",
          "output": "5",
          "keyPoints": [
            "Focus on correctness first.",
            "Then improve clarity and complexity."
          ],
          "practice": [
            "Write a small Python program related to easy coding problems.",
            "Create one edge-case test for easy coding problems.",
            "Explain the main idea of easy coding problems in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Easy Coding Problems?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-94",
          "title": "Medium Coding Problems",
          "slug": "medium-coding-problems",
          "explanation": "Medium problems combine multiple patterns and require careful edge-case analysis.",
          "code": "nums = [2,7,11,15]\ntarget = 9\nseen = {}\nfor i,x in enumerate(nums):\n    if target-x in seen: print(seen[target-x], i)\n    seen[x] = i",
          "output": "0 1",
          "keyPoints": [
            "Hashing can turn pair search into linear time.",
            "Always test duplicates and missing solutions."
          ],
          "practice": [
            "Write a small Python program related to medium coding problems.",
            "Create one edge-case test for medium coding problems.",
            "Explain the main idea of medium coding problems in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Medium Coding Problems?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-95",
          "title": "Output Prediction",
          "slug": "output-prediction",
          "explanation": "Placement tests often ask what a short Python program prints.",
          "code": "x = [1,2]\ny = x\ny.append(3)\nprint(x)",
          "output": "[1, 2, 3]",
          "keyPoints": [
            "Assignment can create another reference to the same mutable object.",
            "Trace mutations carefully."
          ],
          "practice": [
            "Write a small Python program related to output prediction.",
            "Create one edge-case test for output prediction.",
            "Explain the main idea of output prediction in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Output Prediction?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-96",
          "title": "Debugging Questions",
          "slug": "debugging-questions",
          "explanation": "Debugging problems test whether you can identify incorrect assumptions and edge cases.",
          "code": "def divide(a,b):\n    if b == 0: return None\n    return a/b\nprint(divide(8,2))",
          "output": "4.0",
          "keyPoints": [
            "Check inputs, state, types, and boundaries.",
            "Use small reproducible examples."
          ],
          "practice": [
            "Write a small Python program related to debugging questions.",
            "Create one edge-case test for debugging questions.",
            "Explain the main idea of debugging questions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Debugging Questions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-97",
          "title": "Interview Questions",
          "slug": "interview-questions",
          "explanation": "Practice explaining Python concepts, trade-offs, and implementation choices aloud.",
          "code": "print('Explain: list vs tuple')",
          "output": "Interview discussion",
          "keyPoints": [
            "Explain with examples.",
            "Mention mutability, performance implications, and use cases."
          ],
          "practice": [
            "Write a small Python program related to interview questions.",
            "Create one edge-case test for interview questions.",
            "Explain the main idea of interview questions in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Interview Questions?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        },
        {
          "id": "lesson-98",
          "title": "Mock Coding Test",
          "slug": "mock-coding-test",
          "explanation": "Combine several topics in a timed practice set to simulate placement conditions.",
          "code": "questions = ['arrays', 'strings', 'hashing', 'loops']\nprint(len(questions))",
          "output": "4",
          "keyPoints": [
            "Read all questions first.",
            "Allocate time according to difficulty.",
            "Leave time for testing."
          ],
          "practice": [
            "Write a small Python program related to mock coding test.",
            "Create one edge-case test for mock coding test.",
            "Explain the main idea of mock coding test in your own words."
          ],
          "quiz": [
            {
              "question": "Which statement best describes Mock Coding Test?",
              "options": [
                "It is a Python concept or technique covered in this lesson.",
                "It is only a database feature.",
                "It is a hardware component.",
                "It is unrelated to programming."
              ],
              "answer": 0
            }
          ]
        }
      ]
    }
  ]
}
};

// Get course content based on the selected course
export function getCourseContent(course) {
  if (!course) return null;

  // Try matching by slug first
  if (course.slug && courseContent[course.slug]) {
    return getcourseContent[course.slug];
  }

  // Try matching by id
  if (course.id && courseContent[course.id]) {
    return getcourseContent[course.id];
  }

  // Try matching by title
  const normalizedTitle = course.title?.toLowerCase().trim();

  if (normalizedTitle) {
    const match = Object.values(courseContent).find(
      (item) => item.title?.toLowerCase().trim() === normalizedTitle
    );

    if (match) return match;
  }

  return null;
}

export default courseContent;
