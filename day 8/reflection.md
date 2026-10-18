### 1. The Most Difficult Concept

The most difficult concept for me was concurrency. I initially thought the system would handle one request at a time, so checking whether a seat was available before booking it seemed safe. However, I learned that two users could check for the same seat simultaneously and both end up booking it. To understand this better, I drew a timeline showing how the requests could overlap and tested the problem using two terminals and a small test table. Seeing both purchases succeed helped me understand the issue. I eventually learned how a conditional UPDATE inside a transaction, together with a UNIQUE constraint, could prevent this problem.

### 2. What I Would Improve in My Capstone

The feedback on my Notes Toolkit was positive, especially regarding its clean code structure, responsive design, safe handling of note text, and use of event delegation. However, I would improve how the application handles errors when saving or retrieving notes from local storage. I would also add more automated tests to check that adding, deleting, and clearing notes work correctly, even when unexpected problems occur. Additionally, I would continue improving accessibility and the mobile experience to make the application more user-friendly and reliable.

### 3. What I Will Learn Next

Next, I want to learn more about PostgreSQL, particularly indexing, isolation levels, and query planning. I also plan to improve my skills in software testing and deployment pipelines. In the future, I hope to apply these skills to real problems in East Africa by integrating mobile money services such as M-Pesa and building applications that work well even with unreliable internet connections. I would love to contribute to solutions that improve community health and financial inclusion.
