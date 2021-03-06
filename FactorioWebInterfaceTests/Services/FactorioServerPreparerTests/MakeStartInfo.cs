﻿using FactorioWebInterface;
using FactorioWebInterface.Hubs;
using FactorioWebInterface.Services;
using FactorioWebInterfaceTests.Utils;
using Moq;
using System.IO.Abstractions;
using System.Linq;
using Xunit;

namespace FactorioWebInterfaceTests.Services.FactorioServerPreparerTests
{
    public class MakeStartInfo
    {
        [Fact]
        public void CorrectFileName()
        {
            // Arrange.
            const string factorioWrapperPath = "FactorioWrapperPath";

            var factorioServerDataService = new Mock<IFactorioServerDataService>(MockBehavior.Strict);
            factorioServerDataService.SetupGet(x => x.FactorioWrapperPath).Returns(factorioWrapperPath);

            var service = FactorioServerPreparerHelpers.MakeFactorioServerPreparer(factorioServerDataService: factorioServerDataService.Object);

            var data = ServerDataHelper.MakeMutableData();

            // Act.
            var startInfo = service.MakeStartInfo(data, "startTypeArguments", "");

            // Assert.
            Assert.Equal(factorioWrapperPath, startInfo.FileName);
        }

        [Fact]
        public void CorrectArguments()
        {
            // Arrange.   
            const string factorioWrapperPath = "FactorioWrapperPath";

            var factorioServerDataService = new Mock<IFactorioServerDataService>(MockBehavior.Strict);
            factorioServerDataService.SetupGet(x => x.FactorioWrapperPath).Returns(factorioWrapperPath);

            var service = FactorioServerPreparerHelpers.MakeFactorioServerPreparer(factorioServerDataService: factorioServerDataService.Object);

            var data = ServerDataHelper.MakeMutableData();
            string startTypeArguments = Constants.FactorioLoadSaveFlag + " save_name";

            string expected = $"{data.ServerId} {data.ExecutablePath} {startTypeArguments} --server-settings {data.ServerSettingsPath} --port {data.Port} ";

            // Act.
            var startInfo = service.MakeStartInfo(data, startTypeArguments, "");

            // Assert.
            Assert.Equal(expected, startInfo.Arguments);
        }

        [Fact]
        public void CorrectArguments_WithModDirectory()
        {
            // Arrange.
            const string factorioWrapperPath = "FactorioWrapperPath";
            const string modDirPath = "modDirectoryPath";

            var factorioServerDataService = new Mock<IFactorioServerDataService>(MockBehavior.Strict);
            factorioServerDataService.SetupGet(x => x.FactorioWrapperPath).Returns(factorioWrapperPath);

            var service = FactorioServerPreparerHelpers.MakeFactorioServerPreparer(factorioServerDataService: factorioServerDataService.Object);

            var data = ServerDataHelper.MakeMutableData();
            string startTypeArguments = Constants.FactorioLoadSaveFlag + " save_name";

            string expected = $"{data.ServerId} {data.ExecutablePath} {startTypeArguments} --server-settings {data.ServerSettingsPath} --port {data.Port} --mod-directory {modDirPath}";

            // Act.
            var startInfo = service.MakeStartInfo(data, startTypeArguments, modDirPath);

            // Assert.
            Assert.Equal(expected, startInfo.Arguments);
        }
    }
}
