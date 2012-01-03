if (!window.availableLangs['/src/edu/course-pascal-basics/ex1']) {
    window.availableLangs['/src/edu/course-pascal-basics/ex1'] = {};
}

window.availableLangs['/src/edu/course-pascal-basics/ex1']['en'] = {
    'exercise-help-content': '<h1>Exercise 1</h1>\
\
<p>In this exercise you goal is to write a program which will lead a tank towards\
checkpoint. Program is a sequence of instructons perfoming consequently step by step.\
One example of insctuction is a procedure call:</p>\
\
<pre class="code">move(steps);</pre>\
\
<p>With this instruction you can make tank to move given steps forward. In this\
example \'move\' is a procedure name. Next after a procedure name are argument list\
encolsed with round brackets. There are only one argument in the example above,\
and this argument are number of step to move forward.</p>\
\
<p>Another procedure call can be this:</p>\
\
<pre class="code">turn(direction);</pre>\
\
<p>This instruction make tank to turn to gived direction. \'direction\' arugument\
of \'turn\' procedure should be a string. Strings in the Pascal language should be\
enclosed with single quoted. This is need by a compiler to split strings and\
keywords or procedure\'s names. So to turn tank to the east, you\
should write this:</p>\
\
<pre class="code">turn(\'east\');</pre>\
\
<p>other appropriate values are \'west\' - turn westward, \'north\' -\
turn northward and \'south\' - turn southward.</p>\
\
<p>In this exercise tank should move 11 steps forward, then turn to the right\
and move another 10 step forward.</p>\
\
<p>Here is a final program source code:</p>\
\
<pre class="code">\
Program Level1;\n\
begin\n\
  move(11);\n\
  turn(\'east\');\n\
  move(10);\n\
end.\n\
</pre>\
\
<p>After you finish writing program, click "Execute code" button to run a program.</p>'
};
