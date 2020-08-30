loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');
loadModule('/TraceCompass/Trace');
loadModule('/TraceCompass/Filters');


//how many cpus do we have in the system !//fixme
var thisTrace = getActiveTrace();
var analysis = createScriptedAnalysis(thisTrace, "activetid.js");

if (thisTrace == null) {
    print("Trace is null");
    exit();
}
// var ss = analysis.getStateSystem(false);
var iter = analysis.getEventIterator();
var event = null;
// Write to a csv file, set in the scripting argument
var bufferedWriter = null;
if (argv.length > 0) {
    filename = argv[0]
    bufferedWriter = new java.io.FileWriter(filename);
    print("Writing to file " + filename)
} else {
    print("Printing to console")
}
bufferedWriter.append("Source");
bufferedWriter.append(",");
bufferedWriter.append("Target");
bufferedWriter.append("\n");
function addTidToArray(arr, tid) {
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == tid) {
            return;
        }
    }
    arr.push(tid);
}
print("Extracting metrics...")
var ts_start = new Date().getTime();
var numCPU = 0;
var eventCounter = 0;
// Parse all events
while (iter.hasNext()) {
    event = iter.next();
    if (event.getName() == "sched_switch") {//"lttng_statedump_process_state") {
        if (numCPU < getEventFieldValue(event, "CPU")) {
            numCPU = getEventFieldValue(event, "CPU")
        }
        eventCounter++;
        // get ptid of each active thread and create a list/array/dictionary    
    }
}
print("The sched_switch event occurs " + eventCounter + " times.");
iter = analysis.getEventIterator();
event = null;
var tids = new Array(numCPU + 1)
for (i = 0; i < numCPU + 1; i++) {
    tids[i] = [];
}
var ntids = new Array(numCPU + 1)
for (i = 0; i < numCPU + 1; i++) {
    ntids[i] = [];
}
var tid_set = [];
// var tid_list = new Array(numCPU);
while (iter.hasNext()) {
    event = iter.next();
    if (event.getName() == "sched_switch") {
        cpu = getEventFieldValue(event, "CPU");
        tid = getEventFieldValue(event, "tid");
        ntid = getEventFieldValue(event, "next_tid")
        if ((cpu != null) && (tid != null) && (tid != 0) && (tid != 1) & (ntid != 0) & (ntid != 1)) {
            // Maintain a list of tids
            // tid_list[cpu].push(tid); //fixme
            tids[cpu].push(tid)
            ntids[cpu].push(ntid)
            addTidToArray(tid_set, tid)
            //}
        }
    }
}
// Initialize the adjacency matrix
var source = []
var target = []
for (i = 0; i < tids.length; i++) {
    for (j = 0; j < tids[i].length; j++) {
        source.push(tids[i][j])
        target.push(ntids[i][j])
    }
}
var nodeMatrix = {}
// Populate the matrix with 0's

for (var i = 0; i < tid_set.length; i++) {
    var s_tid = tid_set[i];
    if (s_tid in nodeMatrix == false) {
        nodeMatrix[s_tid] = {}; // must initialize the sub-object, otherwise will get 'undefined' errors
    }
    for (var j = 0; j < tid_set.length; j++) {
        var t_tid = tid_set[j];
        nodeMatrix[s_tid][t_tid] = 0;
    }
}

var iniRank = 1 / tid_set.length
// Write to edgelist.csv
for (i = 0; i < source.length; i++) {
    if (bufferedWriter == null) {
        print(source[i])
    } else {
        bufferedWriter.write(source[i]);
        bufferedWriter.append(",");
        bufferedWriter.write(target[i]);
        bufferedWriter.append("\n");
        // Add weight to each edge
        nodeMatrix[source[i]][target[i]]++;
        nodeMatrix[source[i]][source[i]] = iniRank;
    }
}
print("Creating node matrix...")
if (bufferedWriter != null) {
    bufferedWriter.close();
}
var ts_end = new Date().getTime();
var ts = ts_end - ts_start
print("Time elapsed to extract metrics from trace: " + ts + " ms")
// Pagerank Algorithm
//call this for each cpu separately //fixme
print("Starting network analysis...")
var out = new Array();
for (i = 0; i < tid_set.length; i++) {
    out[tid_set[i]] = 0;
    for (j = 0; j < tid_set.length; j++) {
        if (nodeMatrix[tid_set[i]][tid_set[j]] != 0 && tid_set[i] != tid_set[j]) {
            out[tid_set[i]] += nodeMatrix[tid_set[i]][tid_set[j]];
        }
    }
}
for (i = 0; i < tid_set.length; i++) {
    var deNom = 0;
    for (j = 0; j < tid_set.length; j++) {
        if (nodeMatrix[tid_set[j]][tid_set[i]] != 0 && tid_set[i] != tid_set[j]) {
            deNom += out[tid_set[i]];
        }
    }
    nodeMatrix[tid_set[i]][tid_set[i]] = nodeMatrix[tid_set[i]][tid_set[i]] / deNom
    print("TID: " + tid_set[i] + " has pagerank of " + nodeMatrix[tid_set[i]][tid_set[i]])
}
print("Pagerank done.")
var l = 0;
var l_tid = 0;
for (i = 0; i < tid_set.length; i++) {
    if ((nodeMatrix[tid_set[i]][tid_set[i]] > l) && isFinite(nodeMatrix[tid_set[i]][tid_set[i]])) {
        l = nodeMatrix[tid_set[i]][tid_set[i]]
        l_tid = tid_set[i]
    }
}
var filter = "TID==" + l_tid;
print("Applying filter: " + filter);
applyGlobalFilter(filter);

