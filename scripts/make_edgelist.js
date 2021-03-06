loadModule('/TraceCompass/Analysis');
loadModule('/TraceCompass/DataProvider');
loadModule('/TraceCompass/View');
loadModule('/TraceCompass/Trace');

var thisTrace = getActiveTrace();
var analysis = createScriptedAnalysis(thisTrace, "activetid.js");

if (thisTrace == null) {
    print("Trace is null");
    exit();
}
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
                    print("Adding to cpu 0");
                    cpu0.push(tid);
                    break;
                case (cpu == 1):
                    print("Adding to cpu 1");
                    cpu1.push(tid);
                    break;
                case (cpu == 2):
                    print("Adding to cpu 2");
                    cpu2.push(tid);
                    break;
                default:
                    print("Adding to cpu 3");
                    cpu3.push(tid);
                    break;
            }
        }
    }
}
if (cpu0.length > 0) { print("cpu0"); }
for (i = 0; i < cpu0.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu0[i])
    } else {
        if (cpu0[i] != cpu0[i + 1]) {
            bufferedWriter.write(cpu0[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu0[i + 1]);
            bufferedWriter.newLine();
        }
    }
};
if (cpu1.length > 0) { print("cpu1"); }
for (i = 0; i < cpu1.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu1[i])
    } else {
        if (cpu1[i] != cpu1[i + 1]) {
            bufferedWriter.write(cpu1[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu1[i + 1]);
            bufferedWriter.newLine();
        }
    }
};
if (cpu2.length > 0) { print("cpu2"); }
for (i = 0; i < cpu2.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu2[i])
    } else {
        if (cpu2[i] != cpu2[i + 1]) {
            bufferedWriter.write(cpu2[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu2[i + 1]);
            bufferedWriter.newLine();
        }
    }
};
if (cpu3.length > 0) { print("cpu3"); }
for (i = 0; i < cpu3.length - 1; i++) {
    if (bufferedWriter == null) {
        print(cpu3[i])
    } else {
        if (cpu3[i] != cpu3[i + 1]) {
            bufferedWriter.write(cpu3[i]);
            bufferedWriter.write("             ");
            bufferedWriter.write(cpu3[i + 1]);
            bufferedWriter.newLine();
        }
    }
};
if (bufferedWriter != null) {
    bufferedWriter.close();
    print("Done.")
}
// Done parsing the events, close the state system at the time of the last event, it needs to be done manually otherwise the state system will still be waiting for values and will not be considered finished building
// if (event != null) {
// 	ss.closeHistory(event.getTimestamp().toNanos());
// }