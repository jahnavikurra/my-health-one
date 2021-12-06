window.addEventListener('load', () => {
  const el = $('#app');
  let isDispensing = false;
  const homeTemplate = Handlebars.compile($('#home-template').html());
  const errorTemplate = Handlebars.compile($('#error-template').html());
  let inventory = {
    coke: { count: 10, unit: 25.00 },
    diet: { count: 20, unit: 25.00 },
    dp: { count: 30, unit: 50.00 }, 
    sprite: { count: 10, unit: 25.00 }, 
    fanta: { count: 20, unit: 25.00 }, 
    ginger: { count: 15, unit: 25.00 }};
  const itemMaxCost = Object.keys(inventory).sort((i1, i2) => {
    return inventory[i2].unit - inventory[i1].unit
  })[0];
  const maxCost = inventory[itemMaxCost].unit
  console.log(maxCost);
  let existingReport = localStorage.getItem('inventory');
  if (existingReport) {
    inventory = {
      ...JSON.parse(existingReport)
    };
  } else {
    localStorage.setItem('inventory', JSON.stringify(inventory));
  }

  const router = new Router({
    mode: 'history',
    page404: (path) => {
      const html = errorTemplate({
        color: 'yellow',
        title: 'Error 404 - Page NOT Found!',
        message: `The path '/${path}' does not exist on this site`,
      });
      el.html(html);
    },
  });

  const showError = (error) => {
    const { title, message } = error.response.data;
    const html = errorTemplate({ color: 'red', title, message });
    el.html(html);
  };

  const getResults = async (drink) => {
    id = drink.currentTarget.id;
    drink = inventory[drink.currentTarget.id];
    try {
      inventory[id].count = inventory[id].count - 1;
      localStorage.setItem('inventory', JSON.stringify(inventory));
      updateReport();
      const input = $('#insert-coin').val();
      $('#return-coin').val(input - drink.unit);
      $('#result').html(`Dispensing...`);
      setTimeout(() => {
        $('#result').html(`Enter coin & select your drink`);  
        $('#insert-coin').val('');
        $('#return-coin').val('');
        isDispensing = false;
      }, 4000);
    
    } catch (error) {
      showError(error);
    } finally {
      $('#result-segment').removeClass('loading');
    }
  };

  const calculateDrinks = (drink) => {
    const insertCoin = $('#insert-coin').val();
    const isStockAvailable = inventory[drink.currentTarget.id].count > 0;
    if (insertCoin && insertCoin >= 25 && !isDispensing && isStockAvailable) {
      isDispensing = true;
      $('.ui.error.message').hide();
      $('#result-segment').addClass('loading');
      getResults(drink);
      return false;
    }
    return true;
  };

  router.add('/home', async () => {
    let html = homeTemplate();
    el.html(html);
    try {
     
      const response = {
        data: {
          symbols: {}
        }
    };
    const { symbols } = response.data;
       html = homeTemplate({ symbols });
      
      html = homeTemplate({ symbols });
      el.html(html);
      $('.loading').removeClass('loading');
      updateReport();
      // Specify Submit Handler
      $('.button').click(calculateDrinks);
    } catch (error) {
      showError(error);
    }
  });

  const updateReport = () => {
    $('#report').html(`
    Coca Cola (${inventory.coke.unit}/can): <b> ${inventory.coke.count} Cans remaining</b> <br>
    Diet Coke (${inventory.diet.unit}/can): <b> ${inventory.diet.count} Cans remaining</b> <br>
    Dr. Pepper (${inventory.dp.unit}/can): <b> ${inventory.dp.count} Cans remaining</b> <br>
    Sprite (${inventory.sprite.unit}/can): <b> ${inventory.sprite.count} Cans remaining</b> <br>
    Fanta (${inventory.fanta.unit}/can): <b> ${inventory.fanta.count} Cans remaining</b> <br>
    Ginger Ale (${inventory.ginger.unit}/can): <b> ${inventory.ginger.count} Cans remaining</b> <br>
 `);
  }
  router.navigateTo(window.location.pathname);

  const link = $(`a[href$='${window.location.pathname}']`);
  link.addClass('active');

  $('a').on('click', (event) => {
    event.preventDefault();

    const target = $(event.target);
    $('.item').removeClass('active');
    target.addClass('active');
    const href = target.attr('href');
    const path = href.substr(href.lastIndexOf('/'));
    router.navigateTo(path);
  });
});
