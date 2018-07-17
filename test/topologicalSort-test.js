const tape = require("tape"),
  fs = require("fs"),
  d3_dag = require("../");

const [square, en, ex] = [
  "test/data/square.json",
  "test/data/en.json",
  "test/data/ex.json",
].map(file => d3_dag.dagStratify()(JSON.parse(fs.readFileSync(file))));

tape("topologicalSort() works for line", test => {
  const data = new Array(10).fill(null).map((_, i) => ({ id: i.toString(), parentIds: i ? [ (i - 1).toString() ] : [] }));
  const dag = d3_dag.dagStratify()(data);
  const res = d3_dag.topologicalSort(dag);
  test.equal(dag, res);
  test.ok(dag.nodes().every(n => n.id === n.value.toString()));
  test.end();
});

tape("topologicalSort() works for square", test => {
  const dag = d3_dag.topologicalSort(square);
  const values = new Array(4);
  dag.nodes().forEach(n => values[n.value] = true);
  test.ok(values.every(v => v));

  const [zero, one, two, three] = dag.nodes().sort((a, b) => a.id - b.id);
  test.equal(zero.value, 0);
  test.deepEqual([one, two].map(d => d.value).sort(), [1, 2]);
  test.equal(three.value, 3);
  test.end();
});

tape("topologicalSort() works for N", test => {
  const dag = d3_dag.topologicalSort(en);

  const values = new Array(4);
  dag.nodes().forEach(n => values[n.value] = true)
  test.ok(values.every(v => v));

  const [zero, one, two, three] = dag.nodes().sort((a, b) => a.id - b.id);
  test.notEqual(-1, [0, 1, 2].indexOf(zero.value));
  test.notEqual(-1, [0, 1].indexOf(one.value));
  test.notEqual(-1, [2, 3].indexOf(two.value));
  test.notEqual(-1, [1, 2, 3].indexOf(three.value));
  test.end();
});