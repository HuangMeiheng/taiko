const expect = require('chai').expect;
let {
  openBrowser,
  goto,
  textBox,
  closeBrowser,
  clear,
  setConfig,
  write,
  into,
  $,
  click,
} = require('../../lib/taiko');
let { createHtml, openBrowserArgs, removeFile, resetConfig } = require('./test-util');
const test_name = 'Clear';

describe(test_name, () => {
  let filePath;
  before(async () => {
    let innerHtml = `
        <form>
            <p>
                <label for="name">
                    Name<input type="text" name="user[name]" id="name" value="Example" disabled/>
                </label>
                <label for="email">
                    Email<input type="text" name="user[email]" id="email" value="example@test.com"/>
                </label>
                <label for="address">
                    Address
                    <textarea name="user[address]" id="address">Address in
multiple lines.</textarea>
                </label>

                <label for="country">
                        Country<input type="text" name="user[country]" id="country" value="" onkeyup="displayInfo(this)"/>
                </label>
                <input type="reset" value="Reset" />
            </p>
        </form>
        <div id='info-borad' ></div>
        <script type="text/javascript">
            setTimeout( () => {
                document.getElementById('name').disabled = false;
            }, 50);

            function displayInfo(element) {
                console.log(element)
                console.log(element.value)
                document.getElementById('info-borad').innerText  = element.value;
            }
        </script>
        `;
    filePath = createHtml(innerHtml, test_name);
    await openBrowser(openBrowserArgs);
    await goto(filePath);
    setConfig({
      waitForNavigation: false,
      retryTimeout: 10,
      retryInterval: 10,
    });
  });

  after(async () => {
    resetConfig();
    await closeBrowser();
    removeFile(filePath);
  });

  describe('input field', () => {
    afterEach(async () => {
      await click('Reset');
    });

    it('should clear content', async () => {
      expect(await textBox('Email').value()).to.equal('example@test.com');
      await clear(textBox('Email'));
      expect(await textBox('Email').value()).to.equal('');
    });

    it('should wait for input to be clearable', async () => {
      expect(await textBox('Name').value()).to.equal('Example');
      await clear(textBox('Name'));
      expect(await textBox('Name').value()).to.equal('');
    });
  });

  describe('textarea', () => {
    afterEach(async () => {
      await click('Reset');
    });
    it('should clear whole content', async () => {
      expect(await textBox('Address').value()).to.equal('Address in\nmultiple lines.');
      await clear(textBox('Address'));
      expect(await textBox('Address').value()).to.equal('');
    });
  });

  describe('events', () => {
    afterEach(async () => {
      await click('Reset');
    });
    it('should be trigged after clearing textbox', async () => {
      await write('No man land', into(textBox('Country')));
      expect(await $('#info-borad').text()).to.equal('No man land');
      await clear(textBox('Country'));
      expect(await $('#info-borad').text()).to.equal('');
    });
  });
});
