# coog-bench

Description
-----------

The bench module offers possibilities to obtain data about execution processes.
![alt text](https://github.com/coopengo/coog-bench/Bench.png)

Usage
-----

### Bench

+ The menu bar above contains 4 buttons : 
  - Reinit : Reinit the entire bench. 
  - Drop : Drops the table that is already running and that needs to be teardowned. 
  - Download : Downloads a csv file containing the average results for each test done.
  - Logout : Closes the session.
  
+ The bench contains 6 possibilities of tests :
  - Latency client/server
  - CPU (10M OPs)
  - Memory (1GB allocation)
  - DB Latency (1K pings)
  - DB Read (100K records)
  - DB Write (2K records)

For each test, 4 results are given : number of iterations done, minimum, maximum and the average between these.

Launching the bench is done by clicking which category you want to enable or disable and then clicking on the button underneath.


License
-------

See LICENSE

Copyright
---------

See COPYRIGHT


For more information please visit the Tryton web site:

http://www.tryton.org/
