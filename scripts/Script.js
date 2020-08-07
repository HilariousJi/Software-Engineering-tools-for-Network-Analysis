loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');
loadModule('/TraceCompass/Trace');
loadModule('/TraceCompass/Filters');

var thisTrace = getActiveTrace();
var analysis = createScriptedAnalysis(thisTrace, "activetid.js");

if (thisTrace == null) {
    print("Trace is null");
    exit();
}
var ss = analysis.getStateSystem(false);
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

var tids = new Array();
var tid_list = new Array();
// Parse all events
while (iter.hasNext()) {
    event = iter.next();
    // Do something when the event is a sched_switch
    if (event.getName() == "sched_switch") {
        cpu = getEventFieldValue(event, "CPU");
        tid = getEventFieldValue(event, "tid");
        if ((cpu != null) && (tid != null) && (tid != 0) && (tid != 1)) {
            // Maintain a list of tids
            tid_list.push(tid);
            addTidToArray(tids, tid)
        }
    }
}
// Initialize the adjacency matrix
var source = []
var target = []
for (i = 0; i < tids.length; i++) {
    source.push(tids[i])
    target.push(tids[i])
}
var nodeMatrix = {}
// Populate the matrix with 0's
for (var i = 0; i < source.length; i++) {
    var s_tid = source[i];
    if (s_tid in nodeMatrix == false) {
        nodeMatrix[s_tid] = {}; // must initialize the sub-object, otherwise will get 'undefined' errors
    }

    for (var j = 0; j < target.length; j++) {
        var t_tid = target[j];
        nodeMatrix[s_tid][t_tid] = 0;
    }
}
var iniRank = 1 / tids.length
// Write to edgelist.csv
for (i = 0; i < tid_list.length - 1; i++) {
    if (bufferedWriter == null) {
        print(tid_list[i])
    } else {
        if (tid_list[i] != tid_list[i + 1]) {
            bufferedWriter.write(tid_list[i]);
            bufferedWriter.append(",");
            bufferedWriter.write(tid_list[i + 1]);
            bufferedWriter.append("\n");
            // Add weight to each edge
            nodeMatrix[tid_list[i]][tid_list[i + 1]]++;
            nodeMatrix[tid_list[i]][tid_list[i]] = iniRank;
        }
    }
}
print("Creating node matrix...")
if (bufferedWriter != null) {
    bufferedWriter.close();
    print("Done.")
}
// Pagerank Algorithm
print("Starting pageranking...")
var out = new Array();
for (i = 0; i < tids.length; i++) {
    out[tids[i]] = 0;
    for (j = 0; j < tids.length; j++) {
        if (nodeMatrix[tids[i]][tids[j]] != 0 && tids[i] != tids[j]) {
            out[tids[i]]++
        }
    }
}
for (i = 0; i < tids.length; i++) {
    var deNom = 0;
    for (j = 0; j < tids.length; j++) {
        if (nodeMatrix[tids[j]][tids[i]] != 0 && tids[i] != tids[j]) {
            deNom += out[tids[i]];
        }
    }
    nodeMatrix[tids[i]][tids[i]] = nodeMatrix[tids[i]][tids[i]] / deNom
    print("TID: " + tids[i] + " has pagerank of " + nodeMatrix[tids[i]][tids[i]])
}
print("Pagerank done.")
var l = 0;
var l_tid = 0;
for (i = 0; i < tids.length; i++) {
    if (nodeMatrix[tids[i]][tids[i]] > l) {
        l = nodeMatrix[tids[i]][tids[i]]
        l_tid = tids[i]
    }
}
var filter = "TID==" + l_tid;
print("Applying filter: " + filter);
applyGlobalFilter(filter);

