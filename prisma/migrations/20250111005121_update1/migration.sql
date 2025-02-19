/*
  Warnings:

  - You are about to drop the `CrewAssignment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `planeId` on the `Flight` table. All the data in the column will be lost.
  - You are about to drop the column `planeId` on the `MaintenanceReport` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AircraftModel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `aircraftId` to the `Flight` table without a default value. This is not possible if the table is not empty.
  - Added the required column `aircraftId` to the `MaintenanceReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CrewAssignment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CrewAssignement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightId" INTEGER NOT NULL,
    "crewId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CrewAssignement_flightId_fkey" FOREIGN KEY ("flightId") REFERENCES "Flight" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CrewAssignement_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Aircraft" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tailNumber" TEXT NOT NULL,
    "baseAirportId" INTEGER NOT NULL,
    "modelId" INTEGER NOT NULL,
    "productionDate" DATETIME NOT NULL,
    "acquisitionDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    CONSTRAINT "Aircraft_baseAirportId_fkey" FOREIGN KEY ("baseAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Aircraft_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "AircraftModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Aircraft" ("acquisitionDate", "baseAirportId", "id", "modelId", "productionDate", "status", "tailNumber") SELECT "acquisitionDate", "baseAirportId", "id", "modelId", "productionDate", "status", "tailNumber" FROM "Aircraft";
DROP TABLE "Aircraft";
ALTER TABLE "new_Aircraft" RENAME TO "Aircraft";
CREATE UNIQUE INDEX "Aircraft_tailNumber_key" ON "Aircraft"("tailNumber");
CREATE TABLE "new_Flight" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flightNumber" TEXT NOT NULL,
    "aircraftId" INTEGER NOT NULL,
    "departureAirportId" INTEGER NOT NULL,
    "arrivalAirportId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "expectedDepartureTime" DATETIME NOT NULL,
    "expectedArrivalTime" DATETIME NOT NULL,
    "departureTime" DATETIME,
    "arrivalTime" DATETIME,
    "flightDuration" REAL,
    "departureGate" TEXT,
    "arrivalGate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "airportId" INTEGER,
    CONSTRAINT "Flight_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_departureAirportId_fkey" FOREIGN KEY ("departureAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_arrivalAirportId_fkey" FOREIGN KEY ("arrivalAirportId") REFERENCES "Airport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flight_airportId_fkey" FOREIGN KEY ("airportId") REFERENCES "Airport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Flight" ("airportId", "arrivalAirportId", "arrivalGate", "arrivalTime", "createdAt", "date", "departureAirportId", "departureGate", "departureTime", "expectedArrivalTime", "expectedDepartureTime", "flightDuration", "flightNumber", "id", "status", "updatedAt") SELECT "airportId", "arrivalAirportId", "arrivalGate", "arrivalTime", "createdAt", "date", "departureAirportId", "departureGate", "departureTime", "expectedArrivalTime", "expectedDepartureTime", "flightDuration", "flightNumber", "id", "status", "updatedAt" FROM "Flight";
DROP TABLE "Flight";
ALTER TABLE "new_Flight" RENAME TO "Flight";
CREATE UNIQUE INDEX "Flight_flightNumber_key" ON "Flight"("flightNumber");
CREATE TABLE "new_MaintenanceReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "aircraftId" INTEGER NOT NULL,
    "maintenanceType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "resolvedAt" DATETIME,
    CONSTRAINT "MaintenanceReport_aircraftId_fkey" FOREIGN KEY ("aircraftId") REFERENCES "Aircraft" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MaintenanceReport" ("createdAt", "description", "id", "maintenanceType", "resolvedAt", "status", "updatedAt") SELECT "createdAt", "description", "id", "maintenanceType", "resolvedAt", "status", "updatedAt" FROM "MaintenanceReport";
DROP TABLE "MaintenanceReport";
ALTER TABLE "new_MaintenanceReport" RENAME TO "MaintenanceReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "AircraftModel_name_key" ON "AircraftModel"("name");
