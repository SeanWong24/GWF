import csv
import os
import math
import numpy as np
import sys

try:
    inputPath = sys.argv[1]
    variableStartIndex = int(sys.argv[2])
    latCount = int(sys.argv[3])
    lonCount = int(sys.argv[4])
    outputPath = sys.argv[5]
except:
    print("arguments help: <input_path> <variable_start_index> <lat_count> <lon_count> <output_path>")
    exit()

for fileName in os.listdir(inputPath):
    with open(inputPath + "/" + fileName, "r") as outFile:
        print("Processing file " + fileName + "...")
        reader = csv.reader(outFile)
        ls = list(reader)

        headers = ls.pop(0)

        latIndex = headers.index("latitude")
        lonIndex = headers.index("longitude")

        data = np.zeros((699, 639, len(headers)))

        for item in ls:
            data[int(item[latIndex]), int(item[lonIndex])] = item

        latInterval = 699 / latCount
        lonInterval = 639 / lonCount
        reducedData = np.zeros((latCount, lonCount, len(headers)))
        for lat in range(latCount):
            for lon in range(lonCount):

                reducedData[lat, lon] = np.mean(
                    data[
                        math.ceil(latInterval * lat):math.ceil(latInterval * (lat + 1)),
                        math.ceil(lonInterval * lon):math.ceil(lonInterval * (lon + 1))
                    ],
                    axis = (0, 1)
                )
        
        dataList = list()
        for x in range(latCount):
            for y in range(lonCount):
                d = dict()
                for j in range(len(headers)):
                    d[headers[j]] = reducedData[x, y, j]
                dataList.append(d)

        os.makedirs(outputPath, exist_ok = True)
        outputFilename = outputPath + fileName
        print("Writing to " + outputFilename + "...")
        with open(outputFilename, "w", newline = "") as outFile:
            writer = csv.DictWriter(outFile, fieldnames = headers)
            writer.writeheader()
            writer.writerows(dataList)
        print("Write completed.")

print("done")