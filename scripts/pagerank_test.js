loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');
loadModule('/TraceCompass/Trace');
include("pagerank.js");


var thisTrace = getActiveTrace();
var analysis = createScriptedAnalysis(thisTrace, "activetid.js");

if (thisTrace == null) {
    print("Trace is null");
    exit();
}
var ss = analysis.getStateSystem(false);
var iter = analysis.getEventIterator();
var event = null;
var bufferedWriter = null;
if (argv.length > 0) {
    filename = argv[0]
    bufferedWriter = new java.io.BufferedWriter(new java.io.FileWriter(filename));
    print("Writing to file " + filename)
} else {
    print("Printing to console")
}
bufferedWriter.write("source        target\n");
var cpu0 = [];
var cpu1 = [];
var cpu2 = [];
var cpu3 = [];
// Parse all events
while (iter.hasNext()) {
    event = iter.next();
    // Do something when the event is a sched_switch
    if (event.getName() == "sched_switch") {
        // This function is a wrapper to get the value of field CPU in the event, or return null if the field is not present
        cpu = getEventFieldValue(event, "CPU");
        tid = getEventFieldValue(event, "tid");
        if ((cpu != null) && (tid != null) && (tid != 0)) {
            // Write the tid to the state system, for the attribute corresponding to the cpu
            // quark = ss.getQuarkAbsoluteAndAdd(cpu);
            // modify the value, tid is a long, so "" + tid make sure it's a string for display purposes
            // ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
            switch (true) {
                case (cpu == 0):
                    // print("Adding to cpu 0");
                    cpu0.push(Number(tid));
                    break;
                case (cpu == 1):
                    // print("Adding to cpu 1");
                    cpu1.push(Number(tid));
                    break;
                case (cpu == 2):
                    // print("Adding to cpu 2");
                    cpu2.push(Number(tid));
                    break;
                default:
                    // print("Adding to cpu 3");
                    cpu3.push(Number(tid));
                    break;
            }
        }
    }
}
var nodes_cpu0 = [];
var nodes_cpu1 = [];
var nodes_cpu2 = [];
var nodes_cpu3 = [];
if (cpu0.length > 0) { print("Making edgelist for cpu0."); }
for (i = 0; i < cpu0.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu0[i])
    } else {
        if (cpu0[i] != cpu0[i + 1]) {
            bufferedWriter.write(cpu0[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu0[i + 1]);
            bufferedWriter.newLine();
            nodes_cpu0.push([cpu0[i], cpu0[i + 1]]);
        }
    }
};
if (cpu1.length > 0) { print("Making edgelist for cpu1."); }
for (i = 0; i < cpu1.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu1[i])
    } else {
        if (cpu1[i] != cpu1[i + 1]) {
            bufferedWriter.write(cpu1[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu1[i + 1]);
            bufferedWriter.newLine();
            nodes_cpu1.push([cpu1[i], cpu1[i + 1]]);
        }
    }
};
if (cpu2.length > 0) { print("Making edgelist for cpu2."); }
for (i = 0; i < cpu2.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu2[i])
    } else {
        if (cpu2[i] != cpu2[i + 1]) {
            bufferedWriter.write(cpu2[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu2[i + 1]);
            bufferedWriter.newLine();
            nodes_cpu2.push([cpu2[i], cpu2[i + 1]]);
        }
    }
};
if (cpu3.length > 0) { print("Making edgelist for cpu3."); }
for (i = 0; i < cpu3.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu3[i])
    } else {
        if (cpu3[i] != cpu3[i + 1]) {
            bufferedWriter.write(cpu3[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu3[i + 1]);
            bufferedWriter.newLine();
            nodes_cpu3.push([cpu3[i], cpu3[i + 1]]);
        }
    }
};
if (bufferedWriter != null) {
    bufferedWriter.close();
    print("Done.")
}

linkProb = 0.85 //high numbers are more stable
tolerance = 0.0001 //sensitivity for accuracy of convergence. 
var rank_cpu0 = new Pagerank(nodes_cpu0, linkProb, tolerance, function (err, res) {
    if (err) throw new Error(err)
    print("Ranking for cpu0.")
    for (i = 0; i < nodes_cpu0.length; i++) {
        print(nodes_cpu0[i][0])
        print(res[i])
    }
})
var rank_cpu1 = new Pagerank(nodes_cpu1, linkProb, tolerance, function (err, res) {
    if (err) throw new Error(err)
    print("Ranking for cpu1.")
    for (i = 0; i < nodes_cpu1.length; i++) {
        print(nodes_cpu1[i][0])
        print(res[i])
    }
})
var rank_cpu2 = new Pagerank(nodes_cpu2, linkProb, tolerance, function (err, res) {
    if (err) throw new Error(err)
    print("Ranking for cpu2.")
    for (i = 0; i < nodes_cpu2.length; i++) {
        print(nodes_cpu2[i][0])
        print(res[i])
    }
})
var rank_cpu3 = new Pagerank(nodes_cpu3, linkProb, tolerance, function (err, res) {
    if (err) throw new Error(err)
    print("Ranking for cpu3.")
    for (i = 0; i < nodes_cpu3.length; i++) {
        print(nodes_cpu3[i][0])
        print(res[i])
    }
})

// This condition verifies if the state system is completed. For instance, if it had been built in a previous run of the script, it wouldn't run again.
// if (!ss.waitUntilBuilt(0)) {
//     // State system not built, run the analysis
//     print("Starting Analysis...");
//     runAnalysis();
// }
while (iter.hasNext()) {
    event = iter.next();
    // Do something when the event is a sched_switch
    if (event.getName() == "sched_switch") {
        // This function is a wrapper to get the value of field CPU in the event, or return null if the field is not present
        cpu = getEventFieldValue(event, "CPU");
        tid = getEventFieldValue(event, "tid");
        if ((cpu != null) && (tid != null) && (tid != 0)) {
            // Write the tid to the state system, for the attribute corresponding to the cpu
            // quark = ss.getQuarkAbsoluteAndAdd(cpu);
            // modify the value, tid is a long, so "" + tid make sure it's a string for display purposes
            // ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
            switch (true) {
                case (cpu == 0):
                    // print("Adding to cpu 0");
                    for (i = 0; i < nodes_cpu0.length; i++) {
                        if ((res[i] > 0.0001) && (tid == nodes_cpu0[i][0])) {
                            quark = ss.getQuarkAbsoluteAndAdd(cpu);
                            ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
                        }
                    }
                    break;
                case (cpu == 1):
                    // print("Adding to cpu 1");
                    for (i = 0; i < nodes_cpu1.length; i++) {
                        if ((res[i] > 0.0001) && (tid == nodes_cpu1[i][0])) {
                            quark = ss.getQuarkAbsoluteAndAdd(cpu);
                            ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
                        }
                    }
                    break;
                case (cpu == 2):
                    // print("Adding to cpu 2");
                    for (i = 0; i < nodes_cpu2.length; i++) {
                        if ((res[i] > 0.0001) && (tid == nodes_cpu2[i][0])) {
                            quark = ss.getQuarkAbsoluteAndAdd(cpu);
                            ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
                        }
                    }
                    break;
                default:
                    // print("Adding to cpu 3");
                    for (i = 0; i < nodes_cpu3.length; i++) {
                        if ((res[i] > 0.0001) && (tid == nodes_cpu3[i][0])) {
                            quark = ss.getQuarkAbsoluteAndAdd(cpu);
                            ss.modifyAttribute(event.getTimestamp().toNanos(), "" + tid, quark);
                        }
                    }
                    break;
            }
        }
    }
}
// Done parsing the events, close the state system at the time of the last event, it needs to be done manually otherwise the state system will still be waiting for values and will not be considered finished building
if (event != null) {
    ss.closeHistory(event.getTimestamp().toNanos());
}
// Get a time graph provider from this analysis, displaying all attributes (which are the cpus here)
// Create a map and fill it, because javascript map cannot use the EASE constants as keys
var map = new java.util.HashMap();
map.put(ENTRY_PATH, '*');
provider = createTimeGraphProvider(analysis, map);
if (provider != null) {
    // Open a time graph view displaying this provider
    openTimeGraphView(provider);
}