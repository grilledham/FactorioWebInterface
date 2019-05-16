#if WINDOWS
using SymbolicLinkSupport;
#endif

using System.IO;

namespace FactorioWebInterface.Utils
{
    public static class FileHelpers
    {
        public static void CreateDirectorySymlink(this DirectoryInfo directoryInfo, string linkPath)
        {
#if WINDOWS
            ProcessHelper.RunProcessToEnd("cmd.exe", $"/C MKLINK /D \"{linkPath}\" \"{directoryInfo.FullName}\"");
#else
            ProcessHelper.RunProcessToEnd("/bin/ln", $"-s {directoryInfo.FullName} {linkPath}");
#endif
        }

        public static bool IsSymbolicLink(this DirectoryInfo directoryInfo)
        {
#if WINDOWS
            return DirectoryInfoExtensions.IsSymbolicLink(directoryInfo);
#else
            return ProcessHelper.RunProcessToEnd("/bin/bash", $"-c \"if [ ! -L {directoryInfo.FullName} ] ; then exit 1 ; fi\"");
#endif
        }
    }
}
