
import { AppLayout } from "@/components/layout/AppLayout";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Wine, 
  Beer, 
  GlassWater, 
  Martini, 
  Search,
  CupSoda
} from "lucide-react";

// Guide content by category
const guideContent = {
  wine: {
    title: "Wine Guide",
    icon: Wine,
    description: "Explore the world of wines, from understanding varietals to proper tasting techniques.",
    primaryImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    sections: [
      {
        title: "Wine Types",
        content: `
          <h4>Red Wines</h4>
          <p>Red wines are made from black grapes and get their color from fermenting with the grape skins. Common red wine varietals include Cabernet Sauvignon, Merlot, Pinot Noir, Syrah/Shiraz, and Zinfandel.</p>
          
          <h4>White Wines</h4>
          <p>White wines are typically made from green grapes without the skins during fermentation. Popular white wine varietals include Chardonnay, Sauvignon Blanc, Riesling, and Pinot Grigio.</p>
          
          <h4>Rosé Wines</h4>
          <p>Rosé gets its pink color from limited contact with red grape skins during production. It can range from dry to sweet and is particularly popular in summer months.</p>
          
          <h4>Sparkling Wines</h4>
          <p>These wines contain carbon dioxide, making them fizzy. Champagne is the most famous sparkling wine, but others include Prosecco, Cava, and Sekt.</p>
        `
      },
      {
        title: "Wine Tasting Guide",
        content: `
          <p>Professional wine tasting follows these steps:</p>
          <ol>
            <li><strong>Look:</strong> Observe the wine's color, opacity, and viscosity</li>
            <li><strong>Swirl:</strong> Gently swirl the wine in your glass to release aromas</li>
            <li><strong>Smell:</strong> Identify primary aromas (fruit, floral), secondary aromas (oak, yeast), and tertiary aromas (aging)</li>
            <li><strong>Taste:</strong> Notice sweetness, acidity, tannins, body, and flavor profiles</li>
            <li><strong>Conclude:</strong> Evaluate the finish and overall quality</li>
          </ol>
          <p>Take notes during tastings to develop your palate and remember your preferences.</p>
        `
      },
      {
        title: "Wine and Food Pairing",
        content: `
          <p>Basic wine pairing principles:</p>
          <ul>
            <li><strong>Red wines</strong> pair well with red meats, rich pasta dishes, and aged cheeses</li>
            <li><strong>White wines</strong> complement poultry, fish, seafood, and creamy sauces</li>
            <li><strong>Rosé wines</strong> are versatile and work with charcuterie, salads, and light pasta dishes</li>
            <li><strong>Sparkling wines</strong> pair excellently with appetizers, sushi, and fried foods</li>
          </ul>
          <p>Remember that acidity in wine pairs with fatty foods, and sweetness balances spicy dishes.</p>
        `
      }
    ]
  },
  spirits: {
    title: "Spirits Guide",
    icon: GlassWater,
    description: "Learn about distilled beverages, their production processes, and unique characteristics.",
    primaryImage: "https://images.unsplash.com/photo-1615887023544-3a566f29d822?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    sections: [
      {
        title: "Whiskey/Whisky Types",
        content: `
          <p>Whiskey (or whisky) is a distilled alcoholic beverage made from fermented grain mash and typically aged in wooden casks.</p>
          
          <h4>Bourbon</h4>
          <p>American whiskey made primarily from corn (at least 51%). Must be aged in new charred oak barrels. Known for sweet, vanilla, and caramel notes.</p>
          
          <h4>Scotch</h4>
          <p>Made in Scotland from malted barley or grain. Must be aged for at least 3 years. Single malts come from one distillery, while blends combine multiple distilleries' products. Often has smoky, peaty characteristics.</p>
          
          <h4>Irish Whiskey</h4>
          <p>Made in Ireland, typically triple-distilled for exceptional smoothness. Generally less smoky than Scotch. Must be aged for at least 3 years.</p>
          
          <h4>Japanese Whisky</h4>
          <p>Modeled after Scotch but with unique Japanese craftsmanship. Known for precision, balance, and often subtle flavors.</p>
        `
      },
      {
        title: "Vodka",
        content: `
          <p>A clear distilled spirit typically made from grains or potatoes. Characterized by its neutral flavor profile.</p>
          
          <h4>Production</h4>
          <p>Vodka is distilled from fermented substances like grains, potatoes, or sometimes fruits. It's filtered and diluted to around 40% alcohol by volume (80 proof).</p>
          
          <h4>Flavor Profiles</h4>
          <p>While vodka aims to be neutral, different brands and base ingredients can yield subtle differences:</p>
          <ul>
            <li>Grain-based vodkas often have a clean, crisp profile</li>
            <li>Potato-based vodkas tend to have a creamy, full-bodied mouthfeel</li>
            <li>Flavored vodkas incorporate natural or artificial flavors</li>
          </ul>
          
          <h4>Tasting</h4>
          <p>Quality vodka should be smooth without harsh alcohol burn. Serve chilled to appreciate subtle characteristics.</p>
        `
      },
      {
        title: "Rum",
        content: `
          <p>Distilled from sugarcane byproducts like molasses or directly from sugarcane juice. Originated in the Caribbean.</p>
          
          <h4>Types of Rum</h4>
          <ul>
            <li><strong>White/Silver Rum:</strong> Light-bodied, subtle flavor, minimal aging</li>
            <li><strong>Gold/Amber Rum:</strong> Medium-bodied, aged in oak barrels, caramel color</li>
            <li><strong>Dark Rum:</strong> Full-bodied, aged longer, molasses or caramel added</li>
            <li><strong>Spiced Rum:</strong> Infused with spices like cinnamon, cardamom, anise</li>
            <li><strong>Rhum Agricole:</strong> Made directly from sugarcane juice rather than molasses</li>
          </ul>
          
          <h4>Tasting Notes</h4>
          <p>Depending on the style, rum can exhibit flavors of caramel, vanilla, tropical fruits, spices, and oak. The aging process significantly impacts its profile.</p>
        `
      }
    ]
  },
  beer: {
    title: "Beer Guide",
    icon: Beer,
    description: "Discover different beer styles, brewing methods, and tasting approaches.",
    primaryImage: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    sections: [
      {
        title: "Beer Types",
        content: `
          <h4>Ales</h4>
          <p>Fermented with top-fermenting yeast at warmer temperatures. Ales typically have fruitier, more complex flavors. Common styles include:</p>
          <ul>
            <li><strong>Pale Ale:</strong> Hoppy with balanced maltiness</li>
            <li><strong>IPA (India Pale Ale):</strong> Prominent hop bitterness and aroma</li>
            <li><strong>Stout:</strong> Dark, roasty with coffee and chocolate notes</li>
            <li><strong>Porter:</strong> Medium to full-bodied with chocolate and caramel flavors</li>
            <li><strong>Wheat Beer:</strong> Light, refreshing with notes of banana and clove</li>
          </ul>
          
          <h4>Lagers</h4>
          <p>Fermented with bottom-fermenting yeast at colder temperatures. Generally cleaner, crisper, and more subtle. Types include:</p>
          <ul>
            <li><strong>Pilsner:</strong> Pale, crisp, hoppy</li>
            <li><strong>Märzen/Oktoberfest:</strong> Amber, malty, medium-bodied</li>
            <li><strong>Bock:</strong> Strong, malty, minimal hop character</li>
            <li><strong>Dunkel:</strong> Dark lager with chocolate and caramel notes</li>
          </ul>
        `
      },
      {
        title: "Beer Tasting Guide",
        content: `
          <p>Beer tasting involves examining several characteristics:</p>
          
          <h4>Appearance</h4>
          <p>Note the color, clarity, and head (foam). Colors range from pale straw to black, and can indicate malt types used.</p>
          
          <h4>Aroma</h4>
          <p>Smell for hop characteristics (floral, citrus, pine), malt notes (bread, caramel, chocolate), yeast contributions (fruity, spicy), and any off-flavors.</p>
          
          <h4>Taste</h4>
          <p>Identify sweetness, bitterness, acidity, and specific flavor notes. Notice how flavors evolve from first sip to finish.</p>
          
          <h4>Mouthfeel</h4>
          <p>Consider body (light to full), carbonation level, creaminess, and alcohol warmth.</p>
          
          <h4>Serving Temperature</h4>
          <p>Lighter beers are best served colder (38-45°F), while fuller-bodied beers show more complexity at warmer temperatures (45-55°F).</p>
        `
      },
      {
        title: "Beer Glassware",
        content: `
          <p>Different glass shapes enhance specific beer characteristics:</p>
          
          <h4>Pint Glass</h4>
          <p>Versatile glass for many styles, especially pale ales and stouts.</p>
          
          <h4>Pilsner Glass</h4>
          <p>Tall, tapered glass that showcases carbonation and clarity of lagers.</p>
          
          <h4>Tulip Glass</h4>
          <p>Bulbous with a flared rim, ideal for aromatic Belgian ales and IPAs.</p>
          
          <h4>Weizen Glass</h4>
          <p>Tall with curves, designed for wheat beers to accommodate their fluffy head.</p>
          
          <h4>Snifter</h4>
          <p>Wide bowl with narrower top, perfect for strong, aromatic beers like barleywines and imperial stouts.</p>
        `
      }
    ]
  },
  cocktails: {
    title: "Cocktail Guide",
    icon: Martini,
    description: "Learn about classic and modern cocktails, mixing techniques, and essential bar tools.",
    primaryImage: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80",
    sections: [
      {
        title: "Essential Cocktail Tools",
        content: `
          <p>A well-equipped home bar should include:</p>
          <ul>
            <li><strong>Shaker:</strong> For mixing and chilling cocktails with ice</li>
            <li><strong>Jigger:</strong> For measuring spirits and ingredients precisely</li>
            <li><strong>Bar Spoon:</strong> For stirring cocktails and layering ingredients</li>
            <li><strong>Strainer:</strong> To hold back ice when pouring</li>
            <li><strong>Muddler:</strong> For crushing fruits, herbs, and sugar</li>
            <li><strong>Citrus Juicer:</strong> For extracting fresh juice</li>
            <li><strong>Mixing Glass:</strong> For stirred cocktails</li>
          </ul>
          <p>Quality tools make a significant difference in cocktail preparation.</p>
        `
      },
      {
        title: "Cocktail Techniques",
        content: `
          <h4>Shaking</h4>
          <p>Used for cocktails with fruit juices, egg, dairy, or other non-alcoholic mixers. Shake vigorously with ice for 10-15 seconds until the shaker feels cold.</p>
          
          <h4>Stirring</h4>
          <p>Ideal for spirit-forward cocktails like Manhattans and Martinis. Gently stir with ice in a mixing glass to chill without over-dilution or excessive aeration.</p>
          
          <h4>Building</h4>
          <p>Adding ingredients directly to the serving glass. Common for highballs and simple mixed drinks.</p>
          
          <h4>Muddling</h4>
          <p>Gently crushing ingredients to release flavors and oils. Used in Mojitos, Old Fashioneds, and more.</p>
          
          <h4>Layering</h4>
          <p>Creating distinct layers of different density liqueurs by pouring slowly over the back of a bar spoon.</p>
        `
      },
      {
        title: "Classic Cocktails",
        content: `
          <h4>Old Fashioned</h4>
          <p>A simple combination of whiskey, sugar, bitters, and a twist of citrus. One of the oldest known cocktails.</p>
          
          <h4>Martini</h4>
          <p>Traditionally made with gin and dry vermouth, garnished with an olive or lemon twist. Can also be made with vodka.</p>
          
          <h4>Manhattan</h4>
          <p>A blend of whiskey (typically rye), sweet vermouth, and bitters. Garnished with a cherry.</p>
          
          <h4>Daiquiri</h4>
          <p>A refreshing mix of rum, lime juice, and simple syrup. The classic version is shaken and served straight up, not blended.</p>
          
          <h4>Negroni</h4>
          <p>Equal parts gin, sweet vermouth, and Campari. Known for its distinctive bitter-sweet flavor profile.</p>
          
          <h4>Margarita</h4>
          <p>Tequila, lime juice, and orange liqueur. Often served with salt on the rim.</p>
        `
      }
    ]
  }
};

const AlcoholGuide = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("wine");
  const [mounted, setMounted] = useState(false);
  
  // Ensure components are mounted before rendering
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const currentCategory = guideContent[activeCategory as keyof typeof guideContent];
  
  // Search functionality
  const searchResults = searchQuery.trim() === "" ? [] : Object.entries(guideContent)
    .flatMap(([category, data]) => {
      const matchingSections = data.sections.filter(
        section => 
          section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          section.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return matchingSections.map(section => ({
        category,
        categoryTitle: data.title,
        section
      }));
    });

  // If not mounted yet, don't render anything or show a loading state
  if (!mounted) {
    return (
      <AppLayout activeTab="guide">
        <div className="flex justify-center items-center h-64">
          <p className="text-foreground">Loading guide content...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeTab="guide">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold animate-fade-in text-foreground">Alcohol Guide</h1>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search the guide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {searchQuery.trim() !== "" ? (
          // Search results view
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground">
              Search Results: <span className="text-primary">{searchQuery}</span>
            </h2>
            
            {searchResults.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-card">
                <p className="text-muted-foreground">No results found for your search.</p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  variant="link" 
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {searchResults.map((result, index) => {
                  const CategoryIcon = guideContent[result.category as keyof typeof guideContent].icon;
                  return (
                    <Card key={index} className="hover-elevate">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                          <CategoryIcon size={18} />
                          {result.section.title}
                        </CardTitle>
                        <CardDescription>
                          From {result.categoryTitle}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-sm dark:prose-invert max-w-none text-foreground" 
                          dangerouslySetInnerHTML={{ __html: result.section.content }}
                        />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            <Button onClick={() => setSearchQuery("")} variant="outline" className="mt-4">
              Back to Guide
            </Button>
          </div>
        ) : (
          // Guide content view
          <div className="space-y-8">
            <Tabs 
              value={activeCategory} 
              onValueChange={setActiveCategory}
              className="w-full animate-fade-in"
            >
              <TabsList className="w-full md:w-auto grid grid-cols-2 md:flex md:flex-wrap  gap-2 h-12">
                <TabsTrigger value="wine" className="flex items-center gap-2 px-4 py-2.5">
                  <Wine size={18} /> Wine
                </TabsTrigger>
                <TabsTrigger value="spirits" className="flex items-center gap-2 px-4 py-2.5">
                  <GlassWater size={18} /> Spirits
                </TabsTrigger>
                <TabsTrigger value="beer" className="flex items-center gap-2 px-4 py-2.5">
                  <Beer size={18} /> Beer
                </TabsTrigger>
                <TabsTrigger value="cocktails" className="flex items-center gap-2 px-4 py-2.5">
                  <Martini size={18} /> Cocktails
                </TabsTrigger>
              </TabsList>
              
              {Object.entries(guideContent).map(([category, data]) => {
                const CategoryIcon = data.icon;
                return (
                  <TabsContent key={category} value={category} className="animate-fade-in">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-full text-primary">
                            <CategoryIcon size={28} className="animate-pulse" />
                          </div>
                          <h2 className="text-2xl font-bold text-foreground">{data.title}</h2>
                        </div>
                        
                        <Card className="overflow-hidden border-2 border-border/50 shadow-sm">
                          <CardContent className="p-6">
                            <p className="text-lg text-foreground leading-relaxed animate-fade-in">{data.description}</p>
                          </CardContent>
                        </Card>
                        
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {data.sections.map((section, idx) => (
                            <AccordionItem 
                              key={idx} 
                              value={`section-${idx}`} 
                              className="hover-elevate border rounded-xl overflow-hidden shadow-sm bg-card my-4"
                            >
                              <AccordionTrigger className="text-left text-foreground font-medium px-6 py-4 hover:no-underline hover:bg-muted/30 transition-all">
                                <span className="text-lg">{section.title}</span>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2 px-6 pb-6">
                                <div className="guide-content-wrapper">
                                  <div 
                                    className="prose prose-sm dark:prose-invert max-w-none mt-2 text-foreground guide-content" 
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                  />
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                      
                      <div className="hidden md:block">
                        <Card className="overflow-hidden h-80 sticky top-6 shadow-md border-2 border-border/50 hover-elevate transition-all duration-500">
                          <img 
                            src={data.primaryImage} 
                            alt={data.title} 
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </Card>
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AlcoholGuide;
