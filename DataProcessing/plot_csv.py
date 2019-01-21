import csv
import os
import numpy as np
import matplotlib.pyplot as plt
import sys

try:
    inputPath = sys.argv[1]
    variableStartIndex = int(sys.argv[2])
    outputPath = sys.argv[3]
except:
    print("arguments help: <input_path> <variable_start_index> <output_path>")
    exit()

def getFieldIndex(headers, fieldName):
    return headers.index(fieldName)

for fileName in os.listdir(inputPath):
    with open(inputPath + "/" + fileName, "r") as outFile:
        reader = csv.reader(outFile)
        ls = list(reader)

        headers = ls.pop(0)

        for i in range(variableStartIndex, len(headers)):
            varList = list()
            varName = headers[i]
            for item in ls:
                varList.append(item[i])
            fileOutputPath = outputPath + "/" + fileName.split(sep = ".")[0].replace("-", "/")
            os.makedirs(fileOutputPath, exist_ok = True)
            plt.contourf(np.reshape(varList, (699, 639)))
            plt.axis('off')
            plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
            plt.savefig(fileOutputPath + "/" + varName + ".png", dpi=1000)
            plt.close()