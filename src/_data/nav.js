import navItems from './navigation.json' with { type: 'json' };

export default function () {
	return {
		navMain: {
      name: 'main',
      items: navItems.main
    },
    navFooter: {
      name: 'footer',
      items: navItems.footer
    }
	};
}
