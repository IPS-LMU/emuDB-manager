/*
import {
    beforeEach,
    beforeEachProviders,
    describe,
    expect,
    it,
    inject
} from "@angular/core/testing";
import {
    ComponentFixture,
    TestComponentBuilder
} from "@angular/compiler/testing";
import {Component} from "@angular/core";
import {By} from "@angular/platform-browser";
import {EmudbmanagerTableComponent} from "./emudbmanager-table.component";

describe('Component: EmudbmanagerTable', () => {
    let builder: TestComponentBuilder;

    beforeEachProviders(() => [EmudbmanagerTableComponent]);
    beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
        builder = tcb;
    }));

    it('should inject the component', inject([EmudbmanagerTableComponent],
        (component: EmudbmanagerTableComponent) => {
            expect(component).toBeTruthy();
        }));

    it('should create the component', inject([], () => {
        return builder.createAsync(EmudbmanagerTableComponentTestController)
            .then((fixture: ComponentFixture<any>) => {
                let query = fixture.debugElement.query(By.directive(EmudbmanagerTableComponent));
                expect(query).toBeTruthy();
                expect(query.componentInstance).toBeTruthy();
            });
    }));
});

@Component({
    selector: 'test',
    template: `
    <app-emudbmanager-table></app-emudbmanager-table>
  `,
    directives: [EmudbmanagerTableComponent]
})
class EmudbmanagerTableComponentTestController {
}

*/ 
//# sourceMappingURL=/tmp/broccoli_type_script_compiler-input_base_path-vBa7VSOU.tmp/0/src/app/emudbmanager-table/emudbmanager-table.component.spec.js.map