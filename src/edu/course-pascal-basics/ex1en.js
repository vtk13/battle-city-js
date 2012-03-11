if (!window.availableLangs['/src/edu/course-pascal-basics/ex1']) {
    window.availableLangs['/src/edu/course-pascal-basics/ex1'] = {};
}

window.availableLangs['/src/edu/course-pascal-basics/ex1']['en'] = {
    'exercise-help-content': '<h1>Exercise 1</h1>\
\
<p>In this exercise your goal is to write a program which will lead the tank to \
the checkpoint. \
The program is a sequence of instructions that are executed step by step. \
An example of insctuction is a procedure call:</p>\
\
<pre class="code">move(steps);</pre>\
\
<p>With this instruction you can make to move the tank given steps forward. \
The \'move\' is a procedure name. Next after the procedure name there is arguments list \
enclosed in round brackets. There is only one argument in the example above, \
and this argument are number of steps to move forward.</p>\
\
<p>Another procedure call can be this:</p>\
\
<pre class="code">turn(direction);</pre>\
\
<p>This instruction make tank to turn to gived direction. \'direction\' arugument \
of \'turn\' procedure should be a string. Strings in the Pascal language should be \
enclosed in single quoted. This is need by a compiler to split strings and \
keywords or procedure\'s names. So to turn tank to the east, you \
should write this:</p>\
\
<pre class="code">turn(\'east\');</pre>\
\
<p>other appropriate values are \'west\' - turn westward, \'north\' - \
turn northward and \'south\' - turn southward.</p>\
\
<p>In this exercise tank should move 11 steps forward, then turn to the right \
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
<p>After you finish writing program, click "Run" button to run a program.</p>'
};
