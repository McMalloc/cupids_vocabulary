# encoding: UTF-8

require "sequel"
require "sinatra"
require "json"
require "pry"

DB = Sequel.sqlite("profiles.db")
$items = DB[:items]

def countWords(string)
	h = Hash.new
	words = string.split
	  words.each { |w|
		# next if $common_words.include? w
		if h.has_key?(w)
		  h[w] = h[w] + 1
		else
		  h[w] = 1
		end
	  }
	return h.sort_by { |word, count| -count }
end

get "/" do
	send_file "welcome.html"
end

get "/vis" do
	send_file "index.html"
end

get "/about" do
	@res = []
	$items.filter(id: rand(0..$items.count-1)).map().each_with_index do |col, index|
		@res[index] = col
	end
	erb :about, :locals => {
		:record => @res,
		:number => $items.count
	}
end

post "/counts" do
	request.body.rewind
	@request_payload = JSON.parse request.body.read
	
	@features = @request_payload["features"].inject({}){ |f,(k,v)| 
		f[k.to_sym] = v; f
	}
	puts ""
	puts @features
	puts ""
	@number = @request_payload["number"].to_i
	@essays = @request_payload["essays"]
	@selection = $items.filter(@features)
	@res = Hash.new
	@essays.each { |essay|
		string = @selection.map(("essay" + essay.to_s).to_sym).join(" ")
		@res[("essay" + essay.to_s).to_sym] = countWords(string)[0..@number-1]
	}
	# binding.pry
	@res["nr_of_records".to_s] = @selection.count
	@res.to_json
end

