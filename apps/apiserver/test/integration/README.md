## Notes on writing integration tests

- For concision and flexibility, if we are looking to test an operation X in question,
  by asserting that state A*(n+1) = X(A_n), with A*(n+1) and A*n having certain properties,
  and getting to state A_n is a multi-operation process A_1, A_2, ..., A_n, then don't
  bother with assertions on state A_1, A_2, ..., A*(n-1).
