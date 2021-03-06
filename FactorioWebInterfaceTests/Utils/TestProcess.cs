﻿using FactorioWebInterface.Utils.ProcessAbstractions;
using Microsoft.Win32.SafeHandles;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Text;

namespace FactorioWebInterfaceTests.Utils
{
#pragma warning disable CS0067 // Unused member.
    public class TestProcess : IProcess
    {
        public IntPtr MinWorkingSet { get; set; }
        public IntPtr MaxWorkingSet { get; set; }
        public ProcessModule MainModule { get; } = default!;
        public IntPtr Handle { get; }
        public int HandleCount { get; }
        public IntPtr MainWindowHandle { get; }
        public string MainWindowTitle { get; } = default!;
        public string MachineName { get; } = default!;
        public bool Responding { get; }
        public ISynchronizeInvoke? SynchronizingObject { get; set; } = default!;
        public int BasePriority { get; }
        public bool EnableRaisingEvents { get; set; }
        public int ExitCode { get; }
        public DateTime ExitTime { get; }
        public ProcessModuleCollection Modules { get; } = default!;
        public long NonpagedSystemMemorySize64 { get; }
        public long PagedMemorySize64 { get; }
        public long PagedSystemMemorySize64 { get; }
        public long WorkingSet64 { get; }
        public long VirtualMemorySize64 { get; }
        public TimeSpan UserProcessorTime { get; }
        public TimeSpan TotalProcessorTime { get; }
        public ProcessThreadCollection Threads { get; } = default!;
        public DateTime StartTime { get; }
        public ProcessStartInfo StartInfo { get; set; } = default!;
        public StreamReader StandardOutput { get; } = default!;
        public StreamWriter StandardInput { get; } = default!;
        public bool HasExited { get; }
        public StreamReader StandardError { get; } = default!;
        public SafeProcessHandle SafeHandle { get; } = default!;
        public IntPtr ProcessorAffinity { get; set; }
        public string ProcessName { get; } = default!;
        public TimeSpan PrivilegedProcessorTime { get; }
        public long PrivateMemorySize64 { get; }
        public ProcessPriorityClass PriorityClass { get; set; }
        public bool PriorityBoostEnabled { get; set; }
        public long PeakWorkingSet64 { get; }
        public long PeakVirtualMemorySize64 { get; }
        public long PeakPagedMemorySize64 { get; }
        public int SessionId { get; }
        public int Id { get; }

        public event DataReceivedEventHandler? ErrorDataReceived;
        public event DataReceivedEventHandler? OutputDataReceived;
        public event EventHandler? Exited;

        public void BeginErrorReadLine()
        {
            throw new NotImplementedException();
        }

        public void BeginOutputReadLine()
        {
            throw new NotImplementedException();
        }

        public void CancelErrorRead()
        {
            throw new NotImplementedException();
        }

        public void CancelOutputRead()
        {
            throw new NotImplementedException();
        }

        public void Close()
        {
            throw new NotImplementedException();
        }

        public bool CloseMainWindow()
        {
            throw new NotImplementedException();
        }

        public void Kill()
        {
            throw new NotImplementedException();
        }

        public void Refresh()
        {
            throw new NotImplementedException();
        }

        public bool Start()
        {
            throw new NotImplementedException();
        }

        public void WaitForExit()
        {
            throw new NotImplementedException();
        }

        public bool WaitForExit(int milliseconds)
        {
            throw new NotImplementedException();
        }

        public bool WaitForInputIdle(int milliseconds)
        {
            throw new NotImplementedException();
        }

        public bool WaitForInputIdle()
        {
            throw new NotImplementedException();
        }
    }
}
