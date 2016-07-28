/* tslint:disable:no-unused-variable */

import { By }           from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { addProviders, async, inject } from '@angular/core/testing';
import { WelcomeComponent } from './welcome.component';

describe('Component: Welcome', () => {
  it('should create an instance', () => {
    let component = new WelcomeComponent();
    expect(component).toBeTruthy();
  });
});
