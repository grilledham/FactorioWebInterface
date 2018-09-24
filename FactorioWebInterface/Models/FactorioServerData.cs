﻿using FactorioWrapperInterface;
using System.Collections.Generic;

namespace FactorioWebInterface.Models
{
    public class FactorioServerData
    {
        public string ServerId { get; set; }
        public FactorioServerStatus Status { get; set; }
        public string BaseDirectoryPath { get; set; }
        public string Port { get; set; }

        public static Dictionary<string, FactorioServerData> Servers = new Dictionary<string, FactorioServerData>()
        {
            ["1"] = new FactorioServerData() { ServerId = "1", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/1/", Port = "34201" },
            ["2"] = new FactorioServerData() { ServerId = "2", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/2/", Port = "34202" },
            ["3"] = new FactorioServerData() { ServerId = "3", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/3/", Port = "34203" },
            ["4"] = new FactorioServerData() { ServerId = "4", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/4/", Port = "34204" },
            ["5"] = new FactorioServerData() { ServerId = "5", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/5/", Port = "34205" },
            ["6"] = new FactorioServerData() { ServerId = "6", Status = FactorioServerStatus.Stopped, BaseDirectoryPath = "/factorio/6/", Port = "34206" },
        };
    }
}