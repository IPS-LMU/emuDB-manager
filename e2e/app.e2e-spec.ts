import { EmuDBManagerPage } from './app.po';

describe('emu-db-manager App', function() {
  let page: EmuDBManagerPage;

  beforeEach(() => {
    page = new EmuDBManagerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
