﻿using System;
using System.Threading.Tasks;

namespace Shared
{
    public enum FactorioServerStatus
    {
        Unknown,
        WrapperStarting,
        WrapperStarted,
        Starting,
        Running,
        Stopping,
        Stopped,
        Killing,
        Killed,
        Crashed,
        Updating,
        Updated,
    }

    public interface IFactorioProcessClientMethods
    {
        Task SendToFactorio(string data);
        Task SendArrayToFactorio(string[] data);
        Task Stop();
        Task ForceStop();
        Task GetStatus();
    }

    public interface IFactorioProcessServerMethods
    {
        Task RegisterServerIdWithDateTime(string serverId, DateTime dateTime);
        Task SendFactorioOutputDataWithDateTime(string data, DateTime dateTime);
        Task SendWrapperDataWithDateTime(string data, DateTime dateTime);
        Task StatusChangedWithDateTime(FactorioServerStatus newStatus, FactorioServerStatus oldStatus, DateTime dateTime);
    }
}
