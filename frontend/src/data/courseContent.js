// ─────────────────────────────────────────────────────────────────────────────
// EVOLVA — Static Course Content Library
// GFG / W3Schools-style: intro → explanation → syntax → example + output →
// key points → practice problems
//
// Each course matches a tag in COURSES (mock.js):
//   PYTHON | JAVA | DSA | SQL | AI/ML | CLOUD | APTITUDE | FRONTEND
// ─────────────────────────────────────────────────────────────────────────────

export const COURSE_CONTENT = {

  // ═══════════════════════════════════════════════════════════
  // PYTHON
  // ═══════════════════════════════════════════════════════════
  PYTHON: {
    title: "Python for Placement",
    level: "Beginner",
    estimated_hours: 4.5,
    modules: [
      {
        module_title: "Python Basics",
        lessons: [
          {
            lesson_title: "Variables & Data Types",
            introduction: "In Python, variables are containers that store data values. Python is dynamically typed — you don't declare a type, Python figures it out from the value you assign.",
            explanation: `A variable is created the moment you first assign a value to it. Python supports several built-in data types:\n\n• int — whole numbers (42, -7)\n• float — decimals (3.14, -0.5)\n• str — text ("hello")\n• bool — True or False\n• list, tuple, dict, set — collections\n\nYou can check a variable's type using the built-in type() function. Variables can be reassigned to different types at any point — Python won't complain.`,
            syntax: `variable_name = value`,
            example_code: `name = "Alice"\nage = 22\ngpa = 8.5\nis_placed = False\n\nprint(name, age, gpa, is_placed)\nprint(type(age))`,
            example_output: `Alice 22 8.5 False\n<class 'int'>`,
            example_explanation: "We create four variables of different types and print them together. type() confirms age is an int.",
            key_points: [
              "No keyword needed to declare a variable — just assign it",
              "Python is dynamically typed; type is inferred at runtime",
              "Use type() to inspect a variable's type",
              "Variable names are case-sensitive: age ≠ Age",
            ],
            practice_problems: [
              "Create variables for your name, age, and CGPA and print them in one line.",
              "What is the type of True? Verify with type().",
              "Swap two variables a=10, b=20 without using a third variable.",
            ],
          },
          {
            lesson_title: "Control Flow — if / elif / else",
            introduction: "Control flow lets your program make decisions. Python uses if, elif, and else to branch between paths based on conditions.",
            explanation: `Python evaluates a condition (which results in True or False) and runs the matching block. Indentation (4 spaces or 1 tab) defines the block — Python has no curly braces.\n\nComparison operators used in conditions:\n  ==  equal\n  !=  not equal\n  >   greater than\n  <   less than\n  >=  greater than or equal\n  <=  less than or equal\n\nYou can chain conditions with and / or / not.`,
            syntax: `if condition:\n    # block runs if True\nelif another_condition:\n    # runs if first was False, this is True\nelse:\n    # runs if all above were False`,
            example_code: `score = 75\n\nif score >= 90:\n    grade = "O"\nelif score >= 75:\n    grade = "A"\nelif score >= 60:\n    grade = "B"\nelse:\n    grade = "C"\n\nprint(f"Score: {score} → Grade: {grade}")`,
            example_output: `Score: 75 → Grade: A`,
            example_explanation: "Score 75 satisfies the second condition (>= 75), so grade is set to 'A'. The else block is skipped.",
            key_points: [
              "Indentation is mandatory — it defines the block",
              "elif is short for 'else if'; you can have as many as needed",
              "Only one branch executes — the first True one",
              "else is optional",
            ],
            practice_problems: [
              "Write a program that prints 'Even' or 'Odd' for a given number.",
              "Write a grading program: A+ for 95+, A for 85+, B for 75+, C otherwise.",
              "Check if a year is a leap year (divisible by 4, but not 100, unless also 400).",
            ],
          },
          {
            lesson_title: "Loops — for and while",
            introduction: "Loops let you repeat a block of code. Python gives you for (iterate over a sequence) and while (repeat while a condition holds).",
            explanation: `for loop: iterates over any iterable — a list, string, range, etc. It's the most common loop in Python.\n\nwhile loop: keeps running as long as a condition is True. Use it when you don't know upfront how many iterations you need.\n\nbreak — exit the loop immediately\ncontinue — skip the rest of the current iteration, go to the next\nrange(start, stop, step) — generates integers from start to stop-1.`,
            syntax: `# for loop\nfor item in iterable:\n    # block\n\n# while loop\nwhile condition:\n    # block`,
            example_code: `# Sum of first 5 natural numbers\ntotal = 0\nfor i in range(1, 6):\n    total += i\nprint("Sum:", total)\n\n# Print until sentinel\nn = 1\nwhile n <= 4:\n    print(n, end=" ")\n    n += 1`,
            example_output: `Sum: 15\n1 2 3 4`,
            example_explanation: "range(1,6) produces [1,2,3,4,5]. The while loop prints 1 through 4 and stops when n becomes 5.",
            key_points: [
              "for is preferred when iterating over known sequences",
              "while is preferred for condition-based loops",
              "range(n) gives 0 to n-1; range(a,b) gives a to b-1",
              "Infinite loops occur if a while condition never becomes False",
            ],
            practice_problems: [
              "Print multiplication table of 7 using a for loop.",
              "Find the sum of all even numbers from 1 to 100.",
              "Write a program that counts down from 10 to 1 and prints 'Blast off!'.",
            ],
          },
        ],
      },
      {
        module_title: "Functions & OOP",
        lessons: [
          {
            lesson_title: "Defining & Calling Functions",
            introduction: "Functions let you group reusable logic under a name. Instead of repeating code, you define it once and call it wherever needed.",
            explanation: `A Python function is defined with def. It can accept parameters (inputs) and return a value with return.\n\nKey ideas:\n• Parameters are placeholders; arguments are actual values passed in\n• Default parameters: def greet(name="World") — used if argument not provided\n• *args — variable number of positional arguments\n• **kwargs — variable number of keyword arguments\n• Functions return None by default if no return statement\n\nDocstrings (triple-quoted strings right after def) document what the function does — good practice.`,
            syntax: `def function_name(param1, param2="default"):\n    """Docstring: what this function does.\"\"\"\n    # logic\n    return result`,
            example_code: `def calculate_cgpa(marks_list):\n    """Returns CGPA from a list of marks (0-100).\"\"\"\n    total = sum(marks_list)\n    avg = total / len(marks_list)\n    return round(avg / 10, 2)\n\nmarks = [85, 90, 78, 92, 88]\nprint("CGPA:", calculate_cgpa(marks))`,
            example_output: `CGPA: 8.66`,
            example_explanation: "The function sums the marks, divides by count for the average, then scales to a 10-point CGPA and rounds to 2 decimal places.",
            key_points: [
              "def keyword defines a function; parentheses hold parameters",
              "return sends a value back to the caller",
              "Functions are objects — they can be passed as arguments",
              "Default parameter values are evaluated once at definition time",
            ],
            practice_problems: [
              "Write a function is_prime(n) that returns True if n is prime.",
              "Write a function factorial(n) using recursion.",
              "Write a function that takes any number of scores (*args) and returns the highest.",
            ],
          },
          {
            lesson_title: "Classes & Objects (OOP)",
            introduction: "Object-Oriented Programming organises code around objects — entities that combine data (attributes) and behaviour (methods). Python makes OOP straightforward with the class keyword.",
            explanation: `A class is a blueprint; an object is an instance of that blueprint.\n\n__init__: the constructor — called automatically when you create an object. self refers to the object being created.\n\nFour pillars of OOP:\n1. Encapsulation — bundling data and methods together\n2. Inheritance — a child class inherits from a parent class\n3. Polymorphism — same method name, different behaviour\n4. Abstraction — hiding internal complexity\n\nIn interviews, focus on inheritance and method overriding — these come up most often.`,
            syntax: `class ClassName:\n    def __init__(self, param):\n        self.param = param   # instance attribute\n\n    def method(self):\n        return self.param`,
            example_code: `class Student:\n    def __init__(self, name, cgpa):\n        self.name = name\n        self.cgpa = cgpa\n\n    def is_eligible(self):\n        return self.cgpa >= 7.0\n\n    def __str__(self):\n        return f"{self.name} (CGPA: {self.cgpa})"\n\ns = Student("Alice", 8.5)\nprint(s)\nprint("Eligible:", s.is_eligible())`,
            example_output: `Alice (CGPA: 8.5)\nEligible: True`,
            example_explanation: "__str__ is a dunder method Python calls when you print an object. is_eligible checks the placement criteria.",
            key_points: [
              "self is always the first parameter of instance methods",
              "__init__ runs automatically on object creation",
              "Use inheritance: class Child(Parent): to extend a class",
              "Dunder (double-underscore) methods like __str__ integrate with Python built-ins",
            ],
            practice_problems: [
              "Create a BankAccount class with deposit() and withdraw() methods that prevent overdraft.",
              "Create a Shape base class and Circle, Rectangle child classes each with area().",
              "Override __eq__ in a Student class so two students are equal if their roll numbers match.",
            ],
          },
        ],
      },
      {
        module_title: "Data Structures in Python",
        lessons: [
          {
            lesson_title: "Lists, Tuples & Sets",
            introduction: "Python's built-in collection types — list, tuple, and set — cover the majority of data-storage needs in coding interviews.",
            explanation: `List [ ] — ordered, mutable, allows duplicates. The workhorse of Python coding.\nTuple ( ) — ordered, immutable, allows duplicates. Use for fixed data like coordinates.\nSet { } — unordered, mutable, no duplicates. Great for membership testing and removing duplicates.\n\nCommon list operations for interviews:\n  append(x)  — add to end    O(1)\n  pop()      — remove last   O(1)\n  pop(i)     — remove index  O(n)\n  sort()     — in-place sort O(n log n)\n  in         — membership    O(n) for list, O(1) for set`,
            syntax: `lst = [1, 2, 3]       # list\ntup = (1, 2, 3)       # tuple\nst  = {1, 2, 3}       # set`,
            example_code: `# Remove duplicates while preserving order\ndef unique_ordered(seq):\n    seen = set()\n    result = []\n    for x in seq:\n        if x not in seen:\n            seen.add(x)\n            result.append(x)\n    return result\n\nprint(unique_ordered([3, 1, 4, 1, 5, 9, 2, 6, 5, 3]))`,
            example_output: `[3, 1, 4, 5, 9, 2, 6]`,
            example_explanation: "We use a set for O(1) membership checks and a list to preserve order — combining the best of both structures.",
            key_points: [
              "Lists are mutable; tuples are not — prefer tuples for constants",
              "Set membership (in) is O(1) vs O(n) for a list",
              "List comprehension: [x*2 for x in range(5)] is idiomatic Python",
              "sorted() returns a new list; list.sort() sorts in place",
            ],
            practice_problems: [
              "Find the second largest element in a list without sorting.",
              "Given two lists, return their intersection using sets.",
              "Flatten a nested list [[1,2],[3,[4,5]]] into [1,2,3,4,5].",
            ],
          },
          {
            lesson_title: "Dictionaries & Hash Maps",
            introduction: "Dictionaries (dicts) are Python's built-in hash map. They provide O(1) average time for get, set, and delete — making them essential for optimising brute-force O(n²) solutions.",
            explanation: `A dict stores key-value pairs. Keys must be hashable (strings, numbers, tuples); values can be anything.\n\nCommon patterns in interview problems:\n• Frequency count — count occurrences of each element\n• Memoization — cache results of expensive calls\n• Two-sum style — store seen values and look up complements\n• Grouping — group items by a computed key\n\ncollections.defaultdict(int) is extremely useful — it initialises a missing key to 0 automatically, saving you an if-key-in-dict check.`,
            syntax: `d = {}              # empty dict\nd = {"key": value}  # literal\nd[key] = value      # set\nd.get(key, default) # safe get`,
            example_code: `from collections import Counter\n\ndef two_sum(nums, target):\n    seen = {}  # value -> index\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []\n\nprint(two_sum([2, 7, 11, 15], 9))\nprint(Counter("abracadabra"))`,
            example_output: `[0, 1]\nCounter({'a': 5, 'b': 2, 'r': 2, 'c': 1, 'd': 1})`,
            example_explanation: "Two-sum: store each number's index, then for each new number check if its complement was seen. Counter is a dict subclass that auto-counts.",
            key_points: [
              "Dict lookup is O(1) average — use it to avoid nested loops",
              "dict.get(key, default) avoids KeyError on missing keys",
              "collections.Counter and defaultdict are dict subclasses worth memorising",
              "Iterating: for k, v in d.items() gives key-value pairs",
            ],
            practice_problems: [
              "Given a string, find the first non-repeating character.",
              "Check if two strings are anagrams using a dict.",
              "Group a list of words by their sorted letters (anagram groups).",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // DSA
  // ═══════════════════════════════════════════════════════════
  DSA: {
    title: "Complete DSA",
    level: "Advanced",
    estimated_hours: 28,
    modules: [
      {
        module_title: "Arrays & Strings",
        lessons: [
          {
            lesson_title: "Two Pointer Technique",
            introduction: "Two pointers is a pattern where you maintain two indices that move toward each other (or in the same direction) to avoid O(n²) nested loops.",
            explanation: `The two-pointer technique works on sorted arrays or strings. Instead of a nested loop checking every pair, you place one pointer at the start and one at the end, then move them inward based on the comparison.\n\nWhen to use:\n• Finding a pair with a given sum in a sorted array\n• Removing duplicates in-place\n• Reversing a string/array\n• Checking if a string is a palindrome\n• Container with most water\n\nTime complexity: O(n) instead of O(n²)\nSpace complexity: O(1) — no extra array needed.`,
            syntax: `left, right = 0, len(arr) - 1\nwhile left < right:\n    # process arr[left] and arr[right]\n    if condition:\n        left += 1\n    else:\n        right -= 1`,
            example_code: `def pair_with_sum(arr, target):\n    """Return indices of pair that sums to target (sorted input).\"\"\"\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target:\n            return (left, right)\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return None\n\nprint(pair_with_sum([1, 3, 5, 7, 9, 11], 14))\nprint(pair_with_sum([2, 4, 6, 8], 5))`,
            example_output: `(2, 4)\nNone`,
            example_explanation: "Indices 2 and 4 (values 5 and 9) sum to 14. The algorithm moves left up when sum is too small and right down when too large.",
            key_points: [
              "Requires sorted input for the classic sum variant",
              "Eliminates one loop → O(n) from O(n²)",
              "Works on strings too: use two indices directly",
              "Variant: slow/fast pointer for cycle detection in linked lists",
            ],
            practice_problems: [
              "Check if a string is a palindrome using two pointers.",
              "Given a sorted array, remove duplicates in-place and return new length.",
              "Find the container with the most water (LeetCode 11).",
            ],
          },
          {
            lesson_title: "Sliding Window",
            introduction: "Sliding window converts an O(n²) scan of every subarray into O(n) by maintaining a window that expands and contracts as it slides across the array.",
            explanation: `Fixed window: size k is constant — slide by removing leftmost, adding rightmost.\nVariable window: grow right pointer to expand; shrink left pointer when a condition is violated.\n\nRecognise a sliding window problem when:\n• The question asks for a subarray / substring\n• Contiguous elements are involved\n• You're maximising or minimising something over a window\n\nThe key invariant: your window always satisfies the problem constraint. When it doesn't, shrink from the left.`,
            syntax: `# Variable window template\nleft = 0\nfor right in range(len(arr)):\n    # expand: add arr[right] to window\n    while window_invalid:\n        # shrink: remove arr[left] from window\n        left += 1\n    # update answer with current window size`,
            example_code: `def longest_unique_substring(s):\n    seen = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in seen and seen[ch] >= left:\n            left = seen[ch] + 1\n        seen[ch] = right\n        best = max(best, right - left + 1)\n    return best\n\nprint(longest_unique_substring("abcabcbb"))\nprint(longest_unique_substring("pwwkew"))`,
            example_output: `3\n3`,
            example_explanation: "'abc' is the longest unique window in 'abcabcbb'. 'wke' or 'kew' tie for 'pwwkew'. The dict stores the last seen index of each character.",
            key_points: [
              "Fixed window: useful for averages/sums of exactly k elements",
              "Variable window: useful for longest/shortest subarray with constraint",
              "Maintain a hash map or frequency count inside the window",
              "Answer is usually max/min of (right - left + 1)",
            ],
            practice_problems: [
              "Maximum sum subarray of size k.",
              "Longest substring with at most 2 distinct characters.",
              "Minimum window substring containing all characters of a target string.",
            ],
          },
        ],
      },
      {
        module_title: "Linked Lists",
        lessons: [
          {
            lesson_title: "Linked List Fundamentals",
            introduction: "A linked list is a chain of nodes, each holding a value and a pointer to the next node. Unlike arrays, elements are not stored contiguously in memory.",
            explanation: `Node structure:\n  val  — the data\n  next — pointer to the next node (None for the last node)\n\nAdvantages over arrays:\n• O(1) insert/delete at head (no shifting)\n• Dynamic size\n\nDisadvantages:\n• O(n) access by index (no random access)\n• Extra memory for pointers\n\nInterview patterns:\n1. Fast/slow pointer — cycle detection, finding middle\n2. Dummy head — simplifies edge cases at the head\n3. Reversal — done iteratively with 3 pointers\n4. Merge — merge two sorted lists like merge sort`,
            syntax: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next`,
            example_code: `class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n\n# Build 1->2->3->4->5\nhead = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))\nrev = reverse_list(head)\nwhile rev:\n    print(rev.val, end=" -> " if rev.next else "\\n")\n    rev = rev.next`,
            example_output: `5 -> 4 -> 3 -> 2 -> 1`,
            example_explanation: "We iterate with three pointers: prev (reversed so far), curr (current node), nxt (saved next before we overwrite it). Each iteration flips one arrow.",
            key_points: [
              "Always handle edge cases: empty list and single node",
              "Fast/slow pointer: slow moves 1 step, fast moves 2 — they meet at cycle start",
              "Dummy head node eliminates special-casing head deletion",
              "Drawing a diagram before coding linked list problems saves time",
            ],
            practice_problems: [
              "Detect if a linked list has a cycle (Floyd's algorithm).",
              "Find the middle of a linked list in one pass.",
              "Merge two sorted linked lists into one sorted list.",
            ],
          },
        ],
      },
      {
        module_title: "Trees & Graphs",
        lessons: [
          {
            lesson_title: "Binary Tree Traversals",
            introduction: "Tree traversal means visiting every node exactly once in a defined order. The three DFS traversals — inorder, preorder, postorder — are foundational for tree problems.",
            explanation: `Binary Tree Node:\n  val, left, right\n\nDFS Traversals (recursive):\n• Inorder   (Left, Root, Right) → gives sorted output for a BST\n• Preorder  (Root, Left, Right) → used to clone/serialize trees\n• Postorder (Left, Right, Root) → used to delete trees, evaluate expressions\n\nBFS (Level-order): use a queue. Process nodes level by level. Key for shortest path in unweighted trees and 'level k nodes' problems.\n\nAll traversals: O(n) time, O(h) space where h = height.`,
            syntax: `# Recursive inorder\ndef inorder(root):\n    if not root:\n        return []\n    return inorder(root.left) + [root.val] + inorder(root.right)`,
            example_code: `from collections import deque\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val; self.left = left; self.right = right\n\ndef level_order(root):\n    if not root: return []\n    result, queue = [], deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left:  queue.append(node.left)\n            if node.right: queue.append(node.right)\n        result.append(level)\n    return result\n\n#       1\n#      / \\\n#     2   3\n#    / \\\n#   4   5\nroot = TreeNode(1, TreeNode(2, TreeNode(4), TreeNode(5)), TreeNode(3))\nprint(level_order(root))`,
            example_output: `[[1], [2, 3], [4, 5]]`,
            example_explanation: "BFS uses a queue. We snapshot the queue size at each level to separate levels — a very common interview pattern.",
            key_points: [
              "Inorder of a BST is always sorted — use this to validate BSTs",
              "BFS with a deque gives level-by-level access",
              "Recursive DFS uses the call stack; iterative DFS uses an explicit stack",
              "Height of tree = max depth of any leaf, computable with DFS",
            ],
            practice_problems: [
              "Find the maximum depth of a binary tree.",
              "Check if a binary tree is symmetric (mirror of itself).",
              "Find the lowest common ancestor of two nodes in a BST.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // SQL
  // ═══════════════════════════════════════════════════════════
  SQL: {
    title: "SQL Essentials",
    level: "Beginner",
    estimated_hours: 4,
    modules: [
      {
        module_title: "SQL Fundamentals",
        lessons: [
          {
            lesson_title: "SELECT, WHERE & ORDER BY",
            introduction: "SELECT is the most used SQL statement. It retrieves data from a table. WHERE filters rows; ORDER BY sorts the result.",
            explanation: `SQL (Structured Query Language) is declarative — you describe what you want, not how to get it. Every SQL query follows this logical order:\n\n1. FROM   — which table(s)\n2. WHERE  — filter rows\n3. GROUP BY — group for aggregation\n4. HAVING — filter groups\n5. SELECT — which columns\n6. ORDER BY — sort result\n7. LIMIT  — how many rows\n\nCommon WHERE operators:\n  =, !=, <, >, <=, >=\n  BETWEEN a AND b\n  IN (val1, val2, ...)\n  LIKE 'pattern'  (%=any chars, _=one char)\n  IS NULL / IS NOT NULL`,
            syntax: `SELECT column1, column2\nFROM table_name\nWHERE condition\nORDER BY column [ASC|DESC]\nLIMIT n;`,
            example_code: `-- Students table: id, name, dept, cgpa\n\n-- All CS students with CGPA > 8, sorted best first\nSELECT name, cgpa\nFROM students\nWHERE dept = 'CS'\n  AND cgpa > 8.0\nORDER BY cgpa DESC\nLIMIT 5;`,
            example_output: `name      | cgpa\n----------|------\nAlice     | 9.2\nBob       | 8.8\nCharlie   | 8.5`,
            example_explanation: "WHERE filters to CS students with CGPA > 8. ORDER BY cgpa DESC puts highest CGPA first. LIMIT 5 returns at most 5 rows.",
            key_points: [
              "SELECT * is fine for exploration; always name columns in production",
              "NULL is not a value — use IS NULL, never = NULL",
              "LIKE '%abc%' checks if 'abc' appears anywhere in the string",
              "ORDER BY runs after WHERE, so you can sort filtered results",
            ],
            practice_problems: [
              "Find all students whose name starts with 'A' and CGPA is between 7 and 9.",
              "List the top 3 students by CGPA in the 'ECE' department.",
              "Find all records where the email column is NULL.",
            ],
          },
          {
            lesson_title: "JOINs",
            introduction: "JOINs combine rows from two or more tables based on a related column. They are the most tested SQL topic in placement interviews.",
            explanation: `Types of JOINs:\n\nINNER JOIN — returns rows where the condition matches in BOTH tables. Most common.\n\nLEFT JOIN — returns ALL rows from left table + matching rows from right. Non-matching right side is NULL.\n\nRIGHT JOIN — opposite of LEFT JOIN.\n\nFULL OUTER JOIN — returns all rows from both tables; NULL where no match.\n\nSELF JOIN — a table joined with itself (e.g., finding employees who share a manager).\n\nThe ON clause specifies the join condition, usually a foreign key → primary key relationship.`,
            syntax: `SELECT a.col, b.col\nFROM table_a a\nINNER JOIN table_b b ON a.id = b.a_id;`,
            example_code: `-- students(id, name, dept_id)\n-- departments(id, dept_name)\n\n-- All students with their department name\nSELECT s.name, d.dept_name\nFROM students s\nINNER JOIN departments d ON s.dept_id = d.id;\n\n-- Students without a department (dept_id is NULL or unmatched)\nSELECT s.name\nFROM students s\nLEFT JOIN departments d ON s.dept_id = d.id\nWHERE d.id IS NULL;`,
            example_output: `name    | dept_name\n--------|----------\nAlice   | Computer Science\nBob     | Electronics\n\nname\n------\nOrphan`,
            example_explanation: "INNER JOIN returns only students with a matching dept. LEFT JOIN + WHERE d.id IS NULL finds students with no matching department — a classic pattern.",
            key_points: [
              "INNER JOIN = intersection; LEFT JOIN = all of left + intersection",
              "Always alias tables (s, d) when joining to avoid ambiguity",
              "Self-join: FROM employees e1 JOIN employees e2 ON e1.manager_id = e2.id",
              "Multiple joins: just chain them — FROM a JOIN b ON ... JOIN c ON ...",
            ],
            practice_problems: [
              "List all departments and the count of students in each (include departments with 0 students).",
              "Find students who have not submitted any assignment (using LEFT JOIN on assignments table).",
              "Find pairs of students in the same department with the same CGPA.",
            ],
          },
          {
            lesson_title: "GROUP BY, HAVING & Aggregate Functions",
            introduction: "Aggregate functions compute a single result from multiple rows. GROUP BY groups rows so you can aggregate per group. HAVING filters those groups.",
            explanation: `Aggregate functions:\n  COUNT(*) — number of rows\n  SUM(col) — total\n  AVG(col) — average\n  MAX(col) — maximum\n  MIN(col) — minimum\n\nRules:\n• Every non-aggregated column in SELECT must appear in GROUP BY\n• WHERE filters rows BEFORE grouping; HAVING filters groups AFTER\n• COUNT(*) counts all rows including NULLs; COUNT(col) skips NULLs\n\nTypical interview pattern: "Find departments where average CGPA is above X" — that's GROUP BY dept + HAVING AVG(cgpa) > X.`,
            syntax: `SELECT col, AGG_FUNC(col2)\nFROM table\nWHERE row_condition\nGROUP BY col\nHAVING group_condition\nORDER BY AGG_FUNC(col2) DESC;`,
            example_code: `-- students(id, name, dept, cgpa, placed)\n\n-- Departments with avg CGPA > 8, showing placement rate\nSELECT\n    dept,\n    COUNT(*)                              AS total,\n    ROUND(AVG(cgpa), 2)                   AS avg_cgpa,\n    SUM(CASE WHEN placed=1 THEN 1 END)    AS placed_count\nFROM students\nGROUP BY dept\nHAVING AVG(cgpa) > 8.0\nORDER BY avg_cgpa DESC;`,
            example_output: `dept | total | avg_cgpa | placed_count\n-----|-------|----------|--------------\nCS   |   120 |     8.72 |           98\nIT   |    85 |     8.31 |           67`,
            example_explanation: "CASE WHEN inside SUM is a conditional aggregate — a classic pattern for counting rows that meet a condition within a group.",
            key_points: [
              "WHERE before GROUP BY; HAVING after GROUP BY",
              "HAVING can use aliases from SELECT in some databases (not standard SQL)",
              "CASE WHEN inside COUNT/SUM is the SQL equivalent of a conditional count",
              "NULL values are excluded from AVG, SUM, MAX, MIN but not COUNT(*)",
            ],
            practice_problems: [
              "Find the department with the most students.",
              "List years where more than 50% of students were placed.",
              "Find duplicate emails in a users table using GROUP BY and HAVING.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // JAVA
  // ═══════════════════════════════════════════════════════════
  JAVA: {
    title: "Java Mastery",
    level: "Intermediate",
    estimated_hours: 14,
    modules: [
      {
        module_title: "Core Java",
        lessons: [
          {
            lesson_title: "OOP in Java — Classes, Inheritance & Interfaces",
            introduction: "Java is a class-based, object-oriented language. Everything lives inside a class. Understanding OOP in Java is mandatory for every placement interview.",
            explanation: `Key OOP concepts in Java:\n\nClass & Object: A class is a blueprint; new ClassName() creates an object.\n\nInheritance: extends keyword. Java supports single inheritance (one parent class). Subclass inherits all non-private members.\n\nInterface: implements keyword. A class can implement multiple interfaces. An interface defines a contract — what methods a class must have. Since Java 8, interfaces can have default methods.\n\nAbstract class: abstract keyword. Cannot be instantiated; may have abstract methods (no body) that subclasses must implement.\n\nPolymorphism: method overriding (same signature, different class) and overloading (same name, different parameters).`,
            syntax: `class Animal {\n    String name;\n    void speak() { System.out.println("..."); }\n}\nclass Dog extends Animal {\n    @Override\n    void speak() { System.out.println("Woof!"); }\n}\ninterface Trainable {\n    void train(String command);\n}`,
            example_code: `abstract class Shape {\n    abstract double area();\n    void printArea() {\n        System.out.printf("Area: %.2f%n", area());\n    }\n}\nclass Circle extends Shape {\n    double radius;\n    Circle(double r) { this.radius = r; }\n    @Override\n    double area() { return Math.PI * radius * radius; }\n}\nclass Rectangle extends Shape {\n    double w, h;\n    Rectangle(double w, double h) { this.w = w; this.h = h; }\n    @Override\n    double area() { return w * h; }\n}\npublic class Main {\n    public static void main(String[] args) {\n        Shape[] shapes = { new Circle(5), new Rectangle(4, 6) };\n        for (Shape s : shapes) s.printArea();\n    }\n}`,
            example_output: `Area: 78.54\nArea: 24.00`,
            example_explanation: "printArea() is defined once in Shape but calls area() which is overridden differently in each subclass — runtime polymorphism.",
            key_points: [
              "Java supports single inheritance (extends) but multiple interface implementation",
              "@Override annotation catches typos — always use it",
              "Abstract class vs Interface: use abstract class for shared state; interface for pure contracts",
              "final class cannot be extended; final method cannot be overridden",
            ],
            practice_problems: [
              "Create an interface Sortable with a sort() method; implement it in a StudentList class.",
              "Implement a simple Animal hierarchy: Animal → Mammal → Dog, overriding speak() at each level.",
              "Why can't you instantiate an abstract class? What happens if you try?",
            ],
          },
          {
            lesson_title: "Collections Framework",
            introduction: "Java's Collections Framework provides ready-made data structures. Knowing which one to pick — and its complexity — is a common interview differentiator.",
            explanation: `Core interfaces and their common implementations:\n\nList (ordered, allows duplicates):\n  ArrayList  — backed by array, O(1) get, O(n) insert/delete middle\n  LinkedList — O(1) insert/delete at ends, O(n) get\n\nSet (unique elements):\n  HashSet    — O(1) add/contains, unordered\n  TreeSet    — O(log n), sorted order\n  LinkedHashSet — O(1), insertion order\n\nMap (key-value pairs):\n  HashMap    — O(1) get/put, unordered\n  TreeMap    — O(log n), sorted by key\n  LinkedHashMap — O(1), insertion order\n\nQueue / Deque:\n  PriorityQueue — min-heap by default, O(log n) poll\n  ArrayDeque    — O(1) at both ends, preferred over Stack/LinkedList`,
            syntax: `List<String> list = new ArrayList<>();\nMap<String, Integer> map = new HashMap<>();\nSet<Integer> set = new HashSet<>();\nPriorityQueue<Integer> pq = new PriorityQueue<>();`,
            example_code: `import java.util.*;\npublic class TopK {\n    // Return top K frequent elements\n    public static List<Integer> topK(int[] nums, int k) {\n        Map<Integer, Integer> freq = new HashMap<>();\n        for (int n : nums)\n            freq.merge(n, 1, Integer::sum);\n\n        // min-heap of size k keyed by frequency\n        PriorityQueue<Integer> pq =\n            new PriorityQueue<>(Comparator.comparingInt(freq::get));\n        for (int n : freq.keySet()) {\n            pq.offer(n);\n            if (pq.size() > k) pq.poll();\n        }\n        return new ArrayList<>(pq);\n    }\n    public static void main(String[] args) {\n        System.out.println(topK(new int[]{1,1,1,2,2,3}, 2));\n    }\n}`,
            example_output: `[2, 1]`,
            example_explanation: "HashMap counts frequencies. A min-heap of size k keeps only the k most frequent elements — polling the least frequent when the heap exceeds k.",
            key_points: [
              "ArrayList for most use cases; LinkedList only for frequent front insertions",
              "HashMap is unsorted; TreeMap is sorted by key — pick based on need",
              "PriorityQueue is a min-heap; wrap with Collections.reverseOrder() for max-heap",
              "Generics (List<String>) prevent ClassCastException at runtime",
            ],
            practice_problems: [
              "Implement a frequency sort: sort elements by how often they appear.",
              "Find the first non-repeating character in a stream using LinkedHashMap.",
              "Use a TreeMap to implement a phone book with sorted name lookup.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // AI/ML
  // ═══════════════════════════════════════════════════════════
  "AI/ML": {
    title: "Machine Learning Foundations",
    level: "Intermediate",
    estimated_hours: 18,
    modules: [
      {
        module_title: "Supervised Learning",
        lessons: [
          {
            lesson_title: "Linear Regression",
            introduction: "Linear regression predicts a continuous output by fitting a straight line through data points. It's the first algorithm to master — the intuition transfers to almost every other ML model.",
            explanation: `Goal: Find the line y = mx + b (in 2D) or hyperplane that minimises the prediction error.\n\nCost function: Mean Squared Error (MSE)\n  MSE = (1/n) Σ (yᵢ - ŷᵢ)²\n\nGradient Descent: Iteratively adjusts parameters in the direction that reduces MSE:\n  θ := θ - α · ∇J(θ)\nwhere α is the learning rate.\n\nKey assumptions:\n1. Linear relationship between features and output\n2. Errors are normally distributed\n3. No multicollinearity between features\n4. Homoscedasticity (constant variance of errors)\n\nEvaluation metrics:\n  R² (R-squared): 1 = perfect fit, 0 = predicts mean\n  RMSE: Root MSE — in the same units as the target`,
            syntax: `from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)`,
            example_code: `import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score\n\n# Hours studied vs exam score\nX = np.array([[1],[2],[3],[4],[5],[6],[7],[8]])\ny = np.array([35, 45, 50, 60, 65, 75, 80, 88])\n\nmodel = LinearRegression().fit(X, y)\npred_10h = model.predict([[10]])[0]\n\nprint(f"Slope:     {model.coef_[0]:.2f}")\nprint(f"Intercept: {model.intercept_:.2f}")\nprint(f"R²:        {r2_score(y, model.predict(X)):.3f}")\nprint(f"Predicted score for 10h: {pred_10h:.1f}")`,
            example_output: `Slope:     7.74\nIntercept: 26.64\nR²:        0.994\nPredicted score for 10h: 104.0`,
            example_explanation: "Each additional hour of study adds ~7.74 marks. R² of 0.994 means the line explains 99.4% of variance. The 104 prediction exceeds 100 — a sign we're extrapolating beyond training data.",
            key_points: [
              "R² closer to 1 is better; negative R² means the model is worse than just predicting the mean",
              "Feature scaling (StandardScaler) speeds up gradient descent but doesn't affect the final result for linear regression",
              "Multiple linear regression extends this to many features: y = θ₀ + θ₁x₁ + ... + θₙxₙ",
              "Regularisation (Ridge/Lasso) prevents overfitting by penalising large coefficients",
            ],
            practice_problems: [
              "Load the Boston housing dataset and predict house prices. Report RMSE and R².",
              "What happens to R² if you add a random noise feature? Why?",
              "Implement gradient descent for simple linear regression from scratch (no sklearn).",
            ],
          },
          {
            lesson_title: "Classification — Logistic Regression & Decision Trees",
            introduction: "Classification predicts a category. Logistic Regression and Decision Trees are the two most common baseline classifiers — used directly or as building blocks for ensembles.",
            explanation: `Logistic Regression:\nDespite the name, it's a classifier. It passes a linear combination of features through a sigmoid function to output a probability between 0 and 1.\n  σ(z) = 1 / (1 + e⁻ᶻ)\nThreshold (default 0.5): probability > 0.5 → class 1.\n\nDecision Tree:\nSplits data recursively at the feature+threshold that maximises information gain (reduces impurity). At each node: "If feature X > threshold → go right; else → go left."\n\nImpurity measures:\n  Gini = 1 - Σ pᵢ²\n  Entropy = -Σ pᵢ log₂(pᵢ)\n\nEvaluation metrics for classifiers:\n  Accuracy, Precision, Recall, F1-Score, AUC-ROC\n  Use F1 when classes are imbalanced (not accuracy!).`,
            syntax: `from sklearn.linear_model import LogisticRegression\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import classification_report`,
            example_code: `from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.metrics import classification_report\n\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2, random_state=42)\n\ndt = DecisionTreeClassifier(max_depth=3, random_state=42)\ndt.fit(X_train, y_train)\n\nprint(classification_report(y_test, dt.predict(X_test),\n      target_names=iris.target_names))`,
            example_output: `              precision    recall  f1-score   support\n\n      setosa       1.00      1.00      1.00        10\n  versicolor       1.00      1.00      1.00         9\n   virginica       1.00      1.00      1.00        11\n\n    accuracy                           1.00        30`,
            example_explanation: "The Iris dataset is well-separated, so a depth-3 tree achieves perfect classification. In real problems you'll see lower numbers — focus on F1 for imbalanced classes.",
            key_points: [
              "Logistic Regression is linear — add polynomial features for non-linear boundaries",
              "Decision Trees overfit easily — limit max_depth or use Random Forest",
              "Precision = TP/(TP+FP); Recall = TP/(TP+FN); F1 = harmonic mean of both",
              "AUC-ROC measures how well the model separates classes regardless of threshold",
            ],
            practice_problems: [
              "Train a logistic regression on the breast cancer dataset; report precision and recall for the malignant class.",
              "Visualise a decision tree (sklearn.tree.plot_tree). Which feature is most important?",
              "What is the difference between overfitting and underfitting? How would you detect each?",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // CLOUD
  // ═══════════════════════════════════════════════════════════
  CLOUD: {
    title: "Cloud Fundamentals (AWS)",
    level: "Beginner",
    estimated_hours: 9,
    modules: [
      {
        module_title: "Core AWS Services",
        lessons: [
          {
            lesson_title: "EC2 — Virtual Servers in the Cloud",
            introduction: "Amazon EC2 (Elastic Compute Cloud) lets you rent virtual machines on demand. It's the foundational compute service — almost every AWS architecture uses it or a service built on top of it.",
            explanation: `EC2 key concepts:\n\nInstance types:\n  t3.micro — 2 vCPUs, 1GB RAM (free tier eligible)\n  m5.xlarge — 4 vCPUs, 16GB RAM (general purpose)\n  c5.2xlarge — 8 vCPUs, 16GB RAM (compute optimised)\n  r5.large — 2 vCPUs, 16GB RAM (memory optimised)\n\nPricing models:\n  On-Demand — pay by second, no commitment (most flexible)\n  Reserved — 1 or 3 year commitment, up to 75% cheaper\n  Spot — bid for unused capacity, up to 90% cheaper, can be interrupted\n\nKey components:\n  AMI (Amazon Machine Image) — template for the OS and software\n  Security Group — virtual firewall (allow/deny inbound/outbound traffic)\n  Key Pair — SSH access (public key on server, private key on your machine)\n  Elastic IP — static public IP address\n  EBS (Elastic Block Store) — persistent disk storage attached to instances`,
            syntax: `# AWS CLI: launch an instance\naws ec2 run-instances \\\n  --image-id ami-0abcdef1234567890 \\\n  --instance-type t3.micro \\\n  --key-name MyKeyPair \\\n  --security-group-ids sg-12345678`,
            example_code: `# Connect to your EC2 instance after launch\n# 1. Download your .pem key pair\n# 2. Set permissions\nchmod 400 MyKeyPair.pem\n\n# 3. SSH in (replace with your public IP)\nssh -i "MyKeyPair.pem" ec2-user@54.123.45.67\n\n# 4. Install a web server\nsudo yum update -y\nsudo yum install httpd -y\nsudo systemctl start httpd\nsudo systemctl enable httpd\necho "<h1>Hello from EC2!</h1>" | sudo tee /var/www/html/index.html`,
            example_output: `# After setup, visiting http://54.123.45.67 shows:\nHello from EC2!`,
            example_explanation: "We SSH into the instance using the private key, install Apache (httpd), start it, and write a simple HTML page. The Security Group must allow inbound traffic on port 80.",
            key_points: [
              "Always stop (not terminate) instances you want to reuse — terminate deletes them permanently",
              "Security Groups are stateful — allowing inbound automatically allows the response outbound",
              "Spot instances are cheapest but can be reclaimed with 2-minute warning — not for critical workloads",
              "Use IAM roles (not hardcoded keys) for EC2 instances that need to access other AWS services",
            ],
            practice_problems: [
              "Launch a t3.micro, install Nginx, and serve a custom HTML page.",
              "What is the difference between stopping and terminating an EC2 instance?",
              "Configure a Security Group to allow SSH only from your IP address, and HTTP from anywhere.",
            ],
          },
          {
            lesson_title: "S3 — Object Storage",
            introduction: "Amazon S3 (Simple Storage Service) stores any amount of data as objects in buckets. It's infinitely scalable, highly durable (11 9s), and used for everything from static websites to data lakes.",
            explanation: `S3 concepts:\n\nBucket — a container for objects (globally unique name)\nObject — a file + metadata, identified by a key (path-like string)\nKey — "photos/2024/profile.jpg" — objects don't have a real directory structure, the key just contains slashes\n\nStorage classes (cost vs retrieval speed):\n  Standard     — frequently accessed, millisecond retrieval\n  Standard-IA  — infrequent access, lower cost, retrieval fee\n  Glacier      — archival, minutes/hours retrieval, cheapest\n\nCommon uses:\n  • Static website hosting (HTML/CSS/JS, no server needed)\n  • Backup and archival\n  • Data lake for analytics (Athena, Redshift Spectrum read directly from S3)\n  • Distribution origin for CloudFront CDN\n  • ML training data storage\n\nSecurity:\n  By default all buckets and objects are private.\n  Use Bucket Policies or ACLs to grant public access.\n  Use Presigned URLs for temporary access.`,
            syntax: `# AWS CLI: basic S3 operations\naws s3 mb s3://my-bucket-name          # create bucket\naws s3 cp file.txt s3://my-bucket/     # upload\naws s3 ls s3://my-bucket/              # list\naws s3 rm s3://my-bucket/file.txt      # delete`,
            example_code: `import boto3\n\ns3 = boto3.client('s3')\n\n# Upload a file\ns3.upload_file('report.pdf', 'my-company-bucket', 'reports/2024/report.pdf')\n\n# Generate a presigned URL (valid 1 hour)\nurl = s3.generate_presigned_url(\n    'get_object',\n    Params={'Bucket': 'my-company-bucket', 'Key': 'reports/2024/report.pdf'},\n    ExpiresIn=3600\n)\nprint("Download URL:", url[:60], "...")`,
            example_output: `Download URL: https://my-company-bucket.s3.amazonaws.com/report ...`,
            example_explanation: "boto3 is the AWS SDK for Python. We upload a file then generate a presigned URL that lets anyone (with the URL) download it for exactly 1 hour — useful for sharing without making the bucket public.",
            key_points: [
              "S3 key names look like paths but S3 is a flat store — there are no real folders",
              "Enable versioning to protect against accidental deletes/overwrites",
              "Cross-region replication ensures data is available even if one AWS region fails",
              "S3 charges for storage (per GB), requests (per 1000), and data transfer out",
            ],
            practice_problems: [
              "Host a static website on S3 — upload an index.html and enable static website hosting.",
              "Write a Python script that lists all objects in a bucket and prints their sizes.",
              "Set up a lifecycle policy to move objects to Glacier after 90 days.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // APTITUDE
  // ═══════════════════════════════════════════════════════════
  APTITUDE: {
    title: "Quantitative Aptitude Bootcamp",
    level: "Beginner",
    estimated_hours: 6,
    modules: [
      {
        module_title: "Number System & Arithmetic",
        lessons: [
          {
            lesson_title: "Percentages & Profit/Loss",
            introduction: "Percentage problems appear in almost every campus placement test. They are the foundation for profit/loss, interest, and data interpretation questions.",
            explanation: `Core formulae:\n\n  Percentage of X = (X / Total) × 100\n  X% of Y = (X × Y) / 100\n\nPercentage change:\n  % change = ((New - Old) / Old) × 100\n  +ve = increase, -ve = decrease\n\nProfit & Loss:\n  Profit = SP - CP\n  Loss   = CP - SP\n  Profit% = (Profit / CP) × 100\n  Loss%   = (Loss / CP) × 100\n  SP = CP × (1 + Profit% / 100)\n  SP = CP × (1 - Loss% / 100)\n\nSuccessive discounts of a% and b%:\n  Net discount = a + b - (ab/100)  [NOT a + b]`,
            syntax: `profit_pct = (profit / cp) * 100\nsp = cp * (1 + profit_pct / 100)`,
            example_code: `# A shopkeeper buys a laptop for ₹45,000 and sells it\n# at a 15% profit. What is the selling price?\n\ncp = 45000\nprofit_pct = 15\n\nsp = cp * (1 + profit_pct / 100)\nprofit = sp - cp\n\nprint(f"Selling Price: ₹{sp:,.0f}")\nprint(f"Profit:        ₹{profit:,.0f}")\n\n# Two successive discounts of 20% and 10%\noriginal = 1000\nnet_discount = 20 + 10 - (20*10/100)\nfinal_price = original * (1 - net_discount/100)\nprint(f"Net discount: {net_discount}%  Final price: ₹{final_price:.0f}")`,
            example_output: `Selling Price: ₹51,750\nProfit:        ₹6,750\nNet discount: 28.0%  Final price: ₹720`,
            example_explanation: "Successive discounts of 20% and 10% give 28% net, not 30% — because the second discount applies to the already-discounted price.",
            key_points: [
              "Successive discounts: net% = a + b - ab/100 (always less than a + b)",
              "If SP/CP ratio is given: SP > CP → profit; SP < CP → loss",
              "Marked price vs CP vs SP: Discount is on MP; Profit/Loss is on CP",
              "When profit% = loss% on two items, overall there's always a net loss of (x/10)²%",
            ],
            practice_problems: [
              "A TV costs ₹12,000. After a 20% discount and then a 10% discount, what is the final price?",
              "A trader marks goods 40% above cost price and allows a 25% discount. Find profit %.",
              "Rahul's salary increased by 20% then decreased by 20%. What is the net % change?",
            ],
          },
          {
            lesson_title: "Time, Speed & Distance",
            introduction: "Speed-distance-time problems are among the most frequent in aptitude tests. Three simple formulae underpin dozens of problem types.",
            explanation: `Core relationship:\n  Distance = Speed × Time\n  Speed    = Distance / Time\n  Time     = Distance / Speed\n\nUnit conversions (must memorise):\n  km/h → m/s: multiply by 5/18\n  m/s → km/h: multiply by 18/5\n\nRelative Speed:\n  Same direction:    |u - v|\n  Opposite direction: u + v\n\nAverage Speed:\n  If same distance at speed u then v:\n  Avg speed = 2uv / (u + v)  ← NOT (u+v)/2\n\nTrains:\n  Crossing a pole: time = length / speed\n  Crossing a person: time = train length / speed\n  Crossing a platform: time = (train + platform length) / speed\n  Two trains: time = sum of lengths / relative speed`,
            syntax: `# Always convert units before substituting\nspeed_ms = speed_kmh * 5 / 18\ntime = distance / speed_ms`,
            example_code: `def train_crossing_time(train_len, platform_len, speed_kmh):\n    speed_ms = speed_kmh * 5 / 18\n    total_dist = train_len + platform_len\n    time_s = total_dist / speed_ms\n    return round(time_s, 2)\n\n# Train 150m long, platform 300m, speed 90 km/h\nprint(train_crossing_time(150, 300, 90), "seconds")\n\n# Average speed: 60 km/h going, 40 km/h returning\nu, v = 60, 40\navg = 2*u*v / (u+v)\nprint(f"Average speed: {avg} km/h")`,
            example_output: `18.0 seconds\nAverage speed: 48.0 km/h`,
            example_explanation: "Converting 90 km/h → 25 m/s. Total distance = 450m. Time = 450/25 = 18s. Average speed (same distance) = harmonic mean, not arithmetic mean.",
            key_points: [
              "Average speed for equal distances = 2uv/(u+v), always less than (u+v)/2",
              "In train problems, ALWAYS check: are lengths included? What is relative speed?",
              "Boats: upstream speed = b - r, downstream = b + r, where r = stream speed",
              "Meeting point: ratio of speeds = ratio of distances travelled (same time)",
            ],
            practice_problems: [
              "A train 200m long passes a bridge 300m long at 72 km/h. How long does it take?",
              "Two trains 120m and 150m long approach each other at 60 km/h and 90 km/h. When do they clear each other?",
              "A boat goes 15 km upstream in 3 hours and 15 km downstream in 1.5 hours. Find the speed of the stream.",
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // FRONTEND
  // ═══════════════════════════════════════════════════════════
  FRONTEND: {
    title: "React & Modern Frontend",
    level: "Intermediate",
    estimated_hours: 16,
    modules: [
      {
        module_title: "React Fundamentals",
        lessons: [
          {
            lesson_title: "Components & Props",
            introduction: "React applications are built from components — independent, reusable pieces of UI. Props are how a parent component passes data down to a child component.",
            explanation: `A React component is a JavaScript function that returns JSX (HTML-like syntax). Components let you split the UI into small, reusable pieces — each responsible for one thing.\n\nProps (short for properties):\n• Passed from parent to child like HTML attributes\n• Read-only inside the child — a component must never modify its own props\n• Can be any JS value: string, number, object, function, even another component\n• Default props handle missing values gracefully\n\nGolden rules:\n1. Component names must start with an uppercase letter\n2. Every component must return a single root element (or a Fragment <>)\n3. JSX uses className instead of class, htmlFor instead of for`,
            syntax: `function ComponentName({ prop1, prop2 = "default" }) {\n  return <div>{prop1}</div>;\n}`,
            example_code: `function CourseCard({ title, level, hours, tag }) {\n  const tagColors = {\n    Python: "#4f6df5",\n    DSA: "#9b6bf7",\n    SQL: "#14c88e",\n  };\n  return (\n    <div style={{ border: "1px solid #212a3d", borderRadius: 12, padding: 16 }}>\n      <span style={{\n        background: tagColors[tag] || "#5865f2",\n        color: "#fff",\n        borderRadius: 6,\n        padding: "2px 8px",\n        fontSize: 11,\n      }}>\n        {tag}\n      </span>\n      <h3 style={{ color: "#e7ebf3", margin: "8px 0 4px" }}>{title}</h3>\n      <p style={{ color: "#8b93a7", fontSize: 12 }}>\n        {level} · {hours}h\n      </p>\n    </div>\n  );\n}\n\n// Usage:\nfunction App() {\n  return (\n    <CourseCard\n      title="Python for Placement"\n      level="Beginner"\n      hours={4.5}\n      tag="Python"\n    />\n  );\n}`,
            example_output: `[A styled course card with blue 'Python' badge, title, and 'Beginner · 4.5h']`,
            example_explanation: "The parent (App) passes data down as props. CourseCard doesn't know or care where the data came from — it just renders it. This separation is the core of React's component model.",
            key_points: [
              "Props flow one way: parent → child (unidirectional data flow)",
              "Never mutate props — they are read-only in the child",
              "Destructure props in the function signature for cleaner code",
              "Children components are passed via the special children prop",
            ],
            practice_problems: [
              "Build a ProfileCard component that shows a name, role, and avatar initial.",
              "Create a Badge component that takes a label and color prop.",
              "Render a list of 5 CourseCards from an array using .map().",
            ],
          },
          {
            lesson_title: "useState & useEffect Hooks",
            introduction: "Hooks let function components use React features like state and side effects. useState and useEffect are the two hooks you'll use in virtually every component.",
            explanation: `useState:\n  const [state, setState] = useState(initialValue)\n  • state — current value\n  • setState — function to update it (triggers a re-render)\n  • Never mutate state directly: setCount(count + 1), not count++\n  • For objects/arrays, always spread to create a new reference\n\nuseEffect:\n  useEffect(() => { /* side effect */ }, [dependencies])\n  • Runs after every render (no deps), or when deps change\n  • Empty array []: runs once after first render (like componentDidMount)\n  • Return a cleanup function for subscriptions/timers\n  • Common uses: data fetching, subscriptions, DOM manipulation\n\nRule of Hooks:\n  1. Only call hooks at the top level (not inside loops/conditions)\n  2. Only call hooks inside React function components`,
            syntax: `const [count, setCount] = useState(0);\nuseEffect(() => {\n  // runs when dep changes\n  return () => { /* cleanup */ };\n}, [dep]);`,
            example_code: `import { useState, useEffect } from "react";\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n  const [running, setRunning] = useState(false);\n\n  useEffect(() => {\n    if (!running) return;\n    const id = setInterval(() => {\n      setSeconds((s) => s + 1);  // functional update: safe from stale closure\n    }, 1000);\n    return () => clearInterval(id);  // cleanup on pause or unmount\n  }, [running]);\n\n  return (\n    <div>\n      <h2>{seconds}s</h2>\n      <button onClick={() => setRunning((r) => !r)}>\n        {running ? "Pause" : "Start"}\n      </button>\n      <button onClick={() => { setRunning(false); setSeconds(0); }}>\n        Reset\n      </button>\n    </div>\n  );\n}`,
            example_output: `[Timer showing 0s with Start and Reset buttons; clicking Start counts up each second]`,
            example_explanation: "useEffect runs when running changes. We start an interval if running is true and clean it up (return function) when running becomes false — preventing memory leaks.",
            key_points: [
              "setCount(c => c + 1) is safer than setCount(count + 1) inside async code",
              "useEffect cleanup function prevents memory leaks (clear timers, unsubscribe)",
              "Missing dependencies in the array = stale closures and bugs",
              "For complex state transitions, prefer useReducer over multiple useState calls",
            ],
            practice_problems: [
              "Build a character counter: textarea + live count that turns red over 280 characters.",
              "Fetch and display a list of posts from https://jsonplaceholder.typicode.com/posts using useEffect.",
              "Build a debounced search input — only trigger a search 500ms after the user stops typing.",
            ],
          },
        ],
      },
    ],
  },
  // ═══════════════════════════════════════════════════════════
  // AI / ML
  // ═══════════════════════════════════════════════════════════
  "AI/ML": {
    title: "Machine Learning Foundations",
    level: "Intermediate",
    estimated_hours: 18,
    modules: [
      {
        module_title: "Introduction to Machine Learning",
        lessons: [
          {
            lesson_title: "What is Machine Learning?",
            introduction: "Machine Learning is a subset of Artificial Intelligence where systems learn from data to improve their performance on a task without being explicitly programmed.",
            explanation: `Traditional programming: you write explicit rules → computer follows them.
Machine Learning: you give the computer data + expected outputs → it figures out the rules itself.

Three main types:
• Supervised Learning — labelled data (input → known output). e.g. spam detection, price prediction.
• Unsupervised Learning — unlabelled data, find hidden patterns. e.g. customer segmentation, anomaly detection.
• Reinforcement Learning — agent learns by trial and error with rewards/penalties. e.g. game-playing AI, robotics.

The ML workflow:
  1. Collect & clean data
  2. Choose a model
  3. Train (fit the model to training data)
  4. Evaluate (test on unseen data)
  5. Tune & deploy`,
            syntax: `# Scikit-learn universal pattern
from sklearn.ModelClass import ModelName
model = ModelName(hyperparameters)
model.fit(X_train, y_train)       # train
predictions = model.predict(X_test)  # infer`,
            example_code: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# 1. Load data
iris = load_iris()
X, y = iris.data, iris.target

# 2. Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 3. Train
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

# 4. Evaluate
preds = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, preds):.2%}")`,
            example_output: `Accuracy: 100.00%`,
            example_explanation: "We load the classic Iris dataset, split it 80/20, train a K-Nearest Neighbours classifier, and measure accuracy on the held-out test set. 100% here is because Iris is a clean, easy dataset — real-world datasets rarely achieve this.",
            key_points: [
              "ML learns patterns from data rather than following hand-written rules.",
              "Always split data into train and test sets — never evaluate on training data.",
              "Scikit-learn's fit/predict pattern works the same across almost all models.",
              "Accuracy alone is misleading on imbalanced datasets — always check other metrics too.",
            ],
            practice_problems: [
              "Load sklearn's load_digits dataset and train a KNN classifier. What accuracy do you get with k=5?",
              "Change test_size to 0.3. Does accuracy improve or drop? Why?",
              "Try n_neighbors=1 and n_neighbors=10. Which overfits, which underfits?",
            ],
          },
          {
            lesson_title: "Linear Regression",
            introduction: "Linear Regression is the simplest supervised learning algorithm — it models a straight-line relationship between one or more input features and a continuous output value.",
            explanation: `Linear Regression finds the best-fit line through your data points by minimising the sum of squared errors (SSE) between predictions and actual values.

Simple linear regression (one feature):
  y = mx + b
  where m = slope (weight) and b = intercept (bias)

Multiple linear regression (multiple features):
  y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b

Key metrics:
• MAE (Mean Absolute Error) — average absolute difference between predicted and actual.
• MSE (Mean Squared Error) — squares errors, penalises large mistakes more.
• R² (R-squared) — proportion of variance explained by the model. 1 = perfect, 0 = no better than the mean.

Assumptions:
1. Linear relationship between features and target.
2. Errors are normally distributed.
3. No multicollinearity (features shouldn't be highly correlated with each other).`,
            syntax: `from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_train, y_train)
print(model.coef_)      # weights
print(model.intercept_) # bias`,
            example_code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Simulated salary data: years of experience → salary (₹ lakhs)
X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
y = np.array([3.5, 4.2, 5.0, 6.1, 7.0, 8.3, 9.5, 10.8, 12.0, 13.5])

model = LinearRegression()
model.fit(X, y)

preds = model.predict(X)
print(f"Slope (weight): {model.coef_[0]:.4f}")
print(f"Intercept:      {model.intercept_:.4f}")
print(f"MSE:  {mean_squared_error(y, preds):.4f}")
print(f"R²:   {r2_score(y, preds):.4f}")
print(f"\\nPredicted salary for 11 years: ₹{model.predict([[11]])[0]:.2f} L")`,
            example_output: `Slope (weight): 1.0012
Intercept:      2.4424
MSE:  0.0188
R²:   0.9989
Predicted salary for 11 years: ₹13.45 L`,
            example_explanation: "The model learns that each extra year of experience adds roughly ₹1L. R² of 0.9989 means the line explains 99.89% of salary variance — an almost perfect fit for this clean simulated data.",
            key_points: [
              "Linear Regression works best when features and target have a linear relationship.",
              "R² close to 1 = good fit; close to 0 = model barely better than predicting the mean.",
              "MSE penalises large outliers more than MAE — choose based on your tolerance for big errors.",
              "Always plot residuals (errors) to check if assumptions hold.",
            ],
            practice_problems: [
              "Load sklearn's fetch_california_housing dataset and train a LinearRegression model. Report R².",
              "Add a feature 'experience²' to the salary dataset (polynomial feature). Does R² improve?",
              "What happens to the model if you don't scale features when they are on very different scales?",
            ],
          },
        ],
      },
      {
        module_title: "Classification Algorithms",
        lessons: [
          {
            lesson_title: "Logistic Regression",
            introduction: "Despite its name, Logistic Regression is a classification algorithm. It predicts the probability that an input belongs to a particular class.",
            explanation: `Logistic Regression applies the sigmoid function to the output of a linear equation, squashing the result to a value between 0 and 1 — which can be interpreted as a probability.

Sigmoid function:
  σ(z) = 1 / (1 + e⁻ᶻ)   where z = w·x + b

Decision boundary:
  If σ(z) ≥ 0.5 → predict class 1
  If σ(z) <  0.5 → predict class 0

Key metrics for classification:
• Accuracy — correct predictions / total predictions (misleading on imbalanced data).
• Precision — of all predicted positives, how many were actually positive?
• Recall — of all actual positives, how many did we correctly catch?
• F1 Score — harmonic mean of precision and recall. Good single metric for imbalanced data.
• Confusion Matrix — 2×2 table: TP, FP, FN, TN.

Multi-class: set multi_class='multinomial' and solver='lbfgs'.`,
            syntax: `from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
proba = model.predict_proba(X_test)  # returns probabilities
preds = model.predict(X_test)        # returns class labels`,
            example_code: `from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)
preds = model.predict(X_test)

print(confusion_matrix(y_test, preds))
print(classification_report(y_test, preds, target_names=["Malignant","Benign"]))`,
            example_output: `[[ 40   3]
 [  1  70]]
              precision  recall  f1-score  support
   Malignant       0.98    0.93      0.95       43
       Benign       0.96    0.99      0.97       71
    accuracy                         0.96      114`,
            example_explanation: "The model achieved 96% accuracy on breast cancer classification. More importantly, recall for Malignant is 0.93 — we correctly caught 93% of cancer cases, which matters more than raw accuracy in medical settings.",
            key_points: [
              "Logistic Regression outputs a probability, not a raw class — you set the threshold.",
              "Use classification_report, not just accuracy, for a full picture.",
              "High recall = few false negatives (important in medical/fraud detection).",
              "High precision = few false positives (important in spam detection).",
            ],
            practice_problems: [
              "Change the decision threshold from 0.5 to 0.3 using predict_proba. How does recall change?",
              "Apply StandardScaler to features before training. Does accuracy improve?",
              "Train on the Iris dataset (3 classes). What solver supports multi-class out of the box?",
            ],
          },
          {
            lesson_title: "Decision Trees & Random Forests",
            introduction: "A Decision Tree splits data by asking a series of questions at each node. Random Forest combines hundreds of trees to produce a more accurate and robust prediction.",
            explanation: `Decision Tree:
  At each node, the algorithm picks the feature and threshold that best separates the classes (measured by Gini impurity or Information Gain/entropy). Leaf nodes hold the final prediction.

Pros: interpretable, no need to scale features, handles non-linear boundaries.
Cons: prone to overfitting (trees can memorise training data).

Random Forest:
  Trains many decision trees, each on a random subset of data (bagging) and features, then aggregates predictions by majority vote (classification) or average (regression).

Fixes the overfitting problem: individual trees overfit, but their errors are uncorrelated, so averaging them out gives a much better generalisation.

Key hyperparameters:
  n_estimators    — number of trees (more = more stable, but slower)
  max_depth       — max depth of each tree (limits overfitting)
  min_samples_split — minimum samples to split a node
  max_features    — features to consider per split ('sqrt' is default for classification)`,
            syntax: `from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier

dt  = DecisionTreeClassifier(max_depth=5)
rf  = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)`,
            example_code: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pandas as pd

X, y = load_breast_cancer(return_X_y=True)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

dt = DecisionTreeClassifier(random_state=42)
dt.fit(X_train, y_train)

rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

print(f"Decision Tree accuracy: {accuracy_score(y_test, dt.predict(X_test)):.2%}")
print(f"Random Forest accuracy: {accuracy_score(y_test, rf.predict(X_test)):.2%}")

# Feature importance
feat_imp = pd.Series(rf.feature_importances_,
                     index=load_breast_cancer().feature_names)
print("\\nTop 5 features:")
print(feat_imp.nlargest(5))`,
            example_output: `Decision Tree accuracy: 93.86%
Random Forest accuracy: 96.49%

Top 5 features:
worst concave points     0.1423
worst perimeter          0.1178
mean concave points      0.1031
worst radius             0.0987
mean perimeter           0.0812`,
            example_explanation: "Random Forest beats the single Decision Tree by ~2.6%, and gives us feature importances for free — worst concave points is the most predictive feature for cancer diagnosis.",
            key_points: [
              "Decision Trees are easy to interpret but overfit without depth limits.",
              "Random Forest reduces overfitting via bagging and random feature subsets.",
              "Feature importance from Random Forest is a useful tool for feature selection.",
              "More trees generally help, but returns diminish past ~200 trees.",
            ],
            practice_problems: [
              "Train a Decision Tree with max_depth=3 and visualise it using sklearn.tree.plot_tree.",
              "Use GridSearchCV to find the best n_estimators and max_depth for Random Forest.",
              "Compare Random Forest with GradientBoostingClassifier on the same dataset.",
            ],
          },
        ],
      },
      {
        module_title: "Model Evaluation & Improvement",
        lessons: [
          {
            lesson_title: "Cross-Validation & Overfitting",
            introduction: "A model that performs perfectly on training data but poorly on new data is overfit. Cross-validation gives you a more honest estimate of how well your model will generalise.",
            explanation: `Overfitting vs Underfitting:
  • Overfitting — model memorises training data, fails on new data. High train accuracy, low test accuracy.
  • Underfitting — model too simple to capture the pattern. Low accuracy on both train and test.
  • Sweet spot — model generalises well. Train ≈ test accuracy, both reasonably high.

k-Fold Cross-Validation:
  1. Split data into k equal folds.
  2. Train on k-1 folds, evaluate on the remaining fold.
  3. Repeat k times (each fold is the test set once).
  4. Average the k scores — much more reliable than a single train/test split.

Common values: k=5 or k=10.

Learning Curves:
  Plot train vs validation accuracy as training set size grows.
  • If train accuracy is high but validation is low → overfitting → more data or regularisation.
  • If both are low → underfitting → more complex model or more features.`,
            syntax: `from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print(f"Mean: {scores.mean():.3f}, Std: {scores.std():.3f}")`,
            example_code: `from sklearn.datasets import load_breast_cancer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, learning_curve
import numpy as np

X, y = load_breast_cancer(return_X_y=True)
model = RandomForestClassifier(n_estimators=100, random_state=42)

# 5-fold cross-validation
scores = cross_val_score(model, X, y, cv=5, scoring='accuracy')
print("5-Fold CV Scores:", np.round(scores, 4))
print(f"Mean accuracy:   {scores.mean():.4f}")
print(f"Std deviation:   {scores.std():.4f}")

# Stratified — preserves class ratio in each fold
from sklearn.model_selection import StratifiedKFold
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
strat_scores = cross_val_score(model, X, y, cv=skf)
print(f"\\nStratified CV Mean: {strat_scores.mean():.4f}")`,
            example_output: `5-Fold CV Scores: [0.9561 0.9561 0.9737 0.9561 0.9649]
Mean accuracy:   0.9614
Std deviation:   0.0073

Stratified CV Mean: 0.9613`,
            example_explanation: "All 5 folds score between 95.6% and 97.4% — low standard deviation (0.73%) means the model is stable and not just getting lucky on one particular split.",
            key_points: [
              "Never report only training accuracy — always use cross-validation or a held-out test set.",
              "Low std deviation across folds = stable, generalisable model.",
              "Use StratifiedKFold for imbalanced classification datasets.",
              "Learning curves diagnose overfitting vs underfitting visually.",
            ],
            practice_problems: [
              "Compare 5-fold vs 10-fold CV scores on the Iris dataset. Which is more stable?",
              "Deliberately overfit a DecisionTreeClassifier (no max_depth). Show the train vs test accuracy gap.",
              "Plot a learning curve for a LogisticRegression model on the breast cancer dataset.",
            ],
          },
        ],
      },
    ],
  },

};

// Lookup helper: match a COURSES entry to its content
// Handles: "PYTHON", "AI/ML", "FRONTEND", "DSA", etc.
export function getCourseContent(tag) {
  if (!tag) return null;
  const upper = tag.toUpperCase();
  // Direct match first (handles "AI/ML" with slash)
  if (COURSE_CONTENT[upper]) return COURSE_CONTENT[upper];
  // Fallback: strip spaces and slash
  const key = upper.replace(/[\s/]/g, "");
  for (const k of Object.keys(COURSE_CONTENT)) {
    if (k.replace(/[\s/]/g, "") === key) return COURSE_CONTENT[k];
  }
  return null;
}