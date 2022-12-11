import React from 'react';
import ReactDOM from 'react-dom';
import cookie from 'js-cookie';
import Language from '../../components/language';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Md2Html from '../../components/md2html';
import Sidemenu from '../../components/sidemenu';
import siteConfig from '../../../site_config/site';
import docs120Config from '../../../site_config/docs1-2-0';
import docs121Config from '../../../site_config/docs1-2-1';

const docsSource = {
  '1.2.0': docs120Config,
  '1.2.1': docs121Config,
};

const isValidVersion = version => version && docsSource.hasOwnProperty(version);

class Docs extends Md2Html(Language) {
  render() {
    const language = this.getLanguage();
    let dataSource = {};
    // from location path
    let version = window.location.pathname.split('/')[3];
    if (isValidVersion(version) || version === 'latest') {
      cookie.set('docs_version', version);
    }
    // from rendering html
    if (!version && this.props.subdir) {
      version = this.props.subdir.split('/')[0];
    }
    if (isValidVersion(version)) {
      dataSource = docsSource[version][language];
    } else if (isValidVersion(cookie.get('docs_version'))) {
      dataSource = docsSource[cookie.get('docs_version')][language];
    } else if (isValidVersion(siteConfig.docsLatest)) {
      dataSource = docsSource[siteConfig.docsLatest][language];
      dataSource.sidemenu.forEach((menu) => {
        menu.children.forEach((submenu) => {
          submenu.link = submenu.link.replace(`docs/${siteConfig.docsLatest}`, 'docs/latest');
        });
      });
    } else {
      return null;
    }
    const __html = this.props.__html || this.state.__html;
    return (
      <div className="md2html docs-page">
        <Header
          currentKey="docs"
          type="dark"
          logo="/img/logo.png"
          language={language}
          onLanguageChange={this.onLanguageChange}
        />
        <section className="content-section">
          <Sidemenu dataSource={dataSource.sidemenu} />
          <div
            className="doc-content markdown-body"
            ref={(node) => { this.markdownContainer = node; }}
            dangerouslySetInnerHTML={{ __html }}
          />
        </section>
        <Footer logo="/img/ds_gray.svg" language={language} />
      </div>
    );
  }
}

document.getElementById('root') && ReactDOM.render(<Docs />, document.getElementById('root'));

export default Docs;
