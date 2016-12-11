# encoding: UTF-8

require "sequel"
require "sinatra"
require "json"
require "pry"

$common_words = ["<br", "/>", "me", "-i", "class=\"ilink\"", "href=", "<a", "-", "so",
"the",
"of",
"and",
"to",
"a",
"in",
"for",
"is",
"on",
"that",
"by",
"this",
"with",
"i",
"you",
"it",
"not",
"or",
"be",
"are",
"from",
"at",
"as",
"your",
"all",
"have",
"new",
"more",
"an",
"was",
"we",
"will",
"home",
"can",
"us",
"about",
"if",
"page",
"my",
"has",
"search",
"free",
"but",
"our",
"one",
"other",
"do",
"no",
"information",
"time",
"they",
"site",
"he",
"up",
"may",
"what",
"which",
"their",
"news",
"out",
"use",
"any",
"there",
"see",
"only",
"so",
"his",
"when",
"contact",
"here",
"business",
"who",
"web",
"also",
"now",
"help",
"i'm",
"just",
"get",
"pm",
"view",
"online",
"c",
"e",
"first",
"am",
"been",
"would",
"how",
"were",
"me",
"s",
"services",
"some",
"these",
"click",
"its",
"like",
"service",
"x",
"than",
"find"]

DB = Sequel.sqlite("profiles.db")
$items = DB[:items]

def countWords(string)
	h = Hash.new
	words = string.split
	  words.each { |w|
		next if $common_words.include? w
		if h.has_key?(w)
		  h[w] = h[w] + 1
		else
		  h[w] = 1
		end
	  }
	return h.sort_by { |word, count| -count }
end

get "/" do
	send_file "index.html"
end

get "/about" do
	@res = []
	$items.filter(id: rand(0..59945)).map().each_with_index do |col, index|
		@res[index] = col
	end
	erb :about, :locals => {
		:record => @res
	}
end

post "/counts" do
	request.body.rewind
	@request_payload = JSON.parse request.body.read
	
	@features = @request_payload["features"].inject({}){ |f,(k,v)| 
		f[k.to_sym] = v; f
	}
	@number = @request_payload["number"].to_i
	@essays = @request_payload["essays"]
	@selection = $items.filter(@features)
	@res = Hash.new
	@essays.each { |essay|
		string = @selection.map(("essay" + essay.to_s).to_sym).join(" ")
		@res[("essay" + essay.to_s).to_sym] = countWords(string)[0..@number-1]
	}
	# binding.pry
	@res.to_json
end

