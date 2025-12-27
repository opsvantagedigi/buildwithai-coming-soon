// Page initialization moved out of inline HTML to satisfy CSP.
document.addEventListener('DOMContentLoaded', async () => {
  try{
    if(window.BWLayout){
      const root = document.getElementById('app-root') || document.querySelector('.container') || document.body;
      window.BWLayout.renderHeader(root);

      // Decide per page by title heuristics
      const title = (document.title||'').toLowerCase();
      if(title.includes('builder')){
        if(window.BWLayout.renderBuilder) await window.BWLayout.renderBuilder(root);
      } else if(title.includes('dashboard')){
        if(window.BWLayout.renderDashboard) await window.BWLayout.renderDashboard(root);
      } else {
        // default: some pages render a small home area via BWLayout.fetchJson in their own templates
      }

      window.BWLayout.renderFooter(root);
    }
  }catch(e){ console.warn('page-init', e) }
});
