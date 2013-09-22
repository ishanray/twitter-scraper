<?php
class TwitterScraper {
	//Hashtag from User
	public $hashtag;

	public function crawl () {
		$ch = curl_init("https://twitter.com/search?q=%23".$this->hashtag."%20lang%3Aen&f=realtime");

		//Setting Options
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.3) Gecko/20070309 Firefox/2.0.0.3");

		//Grab URL and pass it to the browser
		return $html = curl_exec($ch);

		$curl_close($ch);
		}

	public function parse_html () {
		//Creating a blank results array
		$results = array();

		//Taking out tweets from html
		$dom = new DOMDocument;
		$dom->loadHTML($this->crawl());
		$finder = new DomXPath($dom);
		$classname="tweet-text";
		$nodes = $finder->query("//p[contains(@class, '$classname')]");

		//Populating $results array with tweets
		foreach ($nodes as $node) {
			$results[] .= $node->nodeValue;
		}
		return $results;
	}

	//Returning tweets as JSON
	public function return_json () {
		return json_encode($this->parse_html());
	}

}

function test_input ($data) {
	  $data = trim($data);
	  $data = stripslashes($data);
	  $data = htmlspecialchars($data);

	  //hash tags cannot have spaces
	  $data = preg_replace('/\s+/', '', $data);

	  return $data;
}

$scrape = new TwitterScraper;

$scrape->hashtag = test_input($_GET["hash"]);

$result = $scrape->return_json();

echo $result;