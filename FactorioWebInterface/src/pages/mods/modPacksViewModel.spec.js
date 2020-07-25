import { strict } from "assert";
import { ModsPageTestServiceLocator } from "../../testUtils/testServiceLocator";
import { IModalService } from "../../services/iModalService";
import { NewModPackViewModel } from "./newModPackViewModel";
import { RenameModPackViewModel } from "./renameModPackViewModel";
import { DeleteModPackViewModel } from "./DeleteModPackViewModel";
import { ModsViewModel } from "./modsViewModel";
import { ModsHubService } from "./modsHubService";
import { CollectionChangeType } from "../../ts/utils";
import { IterableHelper } from "../../utils/iterableHelper";
const modPack = {
    Name: 'name',
    CreatedTime: '2020-01-01 00:00:00',
    LastModifiedTime: '2020-01-01 00:00:00'
};
const modPack2 = {
    Name: 'name',
    CreatedTime: '2020-01-02 00:00:00',
    LastModifiedTime: '2020-01-02 00:00:00'
};
describe('ModPacksViewModel', function () {
    let showsModalTestCases = [
        { name: 'new command', command: 'newCommand', arg: undefined, viewModelType: NewModPackViewModel },
        { name: 'rename command', command: 'renameCommand', arg: modPack, viewModelType: RenameModPackViewModel },
        { name: 'delete command', command: 'deleteCommand', arg: modPack, viewModelType: DeleteModPackViewModel },
    ];
    for (let testCase of showsModalTestCases) {
        it(`${testCase.name} shows modal`, function () {
            // Arrange.
            let services = new ModsPageTestServiceLocator();
            let modalService = services.get(IModalService);
            let mainViewModel = services.get(ModsViewModel);
            let viewModel = mainViewModel.modPacksViewModel;
            // Act.
            viewModel[testCase.command].execute(testCase.arg);
            // Assert.
            let method = modalService.methodsCalled[0];
            strict.equal(method.name, 'showViewModel');
            strict.equal(method.args[0] instanceof testCase.viewModelType, true);
        });
    }
    it('updates when first loading', function () {
        // Arrange.
        let services = new ModsPageTestServiceLocator();
        let hub = services.get(ModsHubService);
        hub.methodCalled.subscribe(event => {
            if (event.name === 'whenConnection') {
                const callback = event.args[0];
                callback();
            }
        });
        // Act.
        let mainViewModel = services.get(ModsViewModel);
        let viewModel = mainViewModel.modPacksViewModel;
        // Assert.
        hub.assertMethodCalled('requestModPacks');
    });
    it('updates when hub connection starts', function () {
        // Arrange.
        let services = new ModsPageTestServiceLocator();
        let mainViewModel = services.get(ModsViewModel);
        let viewModel = mainViewModel.modPacksViewModel;
        let hub = services.get(ModsHubService);
        // Act.
        hub._onConnection.raise();
        // Assert.
        hub.assertMethodCalled('requestModPacks');
    });
    it('updates onSendModPacks', function () {
        // Arrange.
        let services = new ModsPageTestServiceLocator();
        let hub = services.get(ModsHubService);
        let mainViewModel = services.get(ModsViewModel);
        let viewModel = mainViewModel.modPacksViewModel;
        // Act.
        hub._onSendModPacks.raise({ Type: CollectionChangeType.Reset, NewItems: [modPack, modPack2] });
        // Assert.
        let actual = IterableHelper.map(viewModel.modPacks.values(), m => m.value);
        // mod packs should be sorted by LastModifiedTime descending.
        let expected = [modPack2, modPack];
        strict.deepEqual([...actual], expected);
    });
});
//# sourceMappingURL=modPacksViewModel.spec.js.map